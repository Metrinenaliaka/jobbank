from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings
from .models import VisaApplication, VisaStage, VisaDocument
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import VisaApplicationSerializer, VisaDocumentSerializer
from rest_framework.exceptions import PermissionDenied

def send_stage_email(stage):
    application = stage.visa_application.application
    user = application.applicant

    subject = ""
    message = ""

    # =========================
    # 1. JOB OFFER
    # =========================
    if stage.key == "job_offer":
        subject = "Job Offer Letter Issued – Action Required"
        message = f"""
Dear {user.full_name},

We are pleased to inform you that your application has been successfully processed, and the hiring company has issued your Job Offer Letter.

📌 Action Required
• Log in to your account:
  https://www.simizi.net  
• Access your dashboard  
• Download your Job Offer Letter  
• Review and sign the document  
• Upload or return the signed copy  

⏳ Deadline  
Kindly submit the signed letter within 3 days to avoid delays or cancellation of your application.

Once received, we will proceed with your Work Permit Application.

If you need assistance, please contact our support team.

Kind regards,  
Simizi Support Team  
https://www.simizi.net
"""

    # =========================
    # 2. WORK PERMIT
    # =========================
    elif stage.key == "work_permit":
        subject = "Work Permit Application in Progress – Under Review"
        message = f"""
Dear {user.full_name},

We would like to inform you that your Work Permit Application has been successfully submitted and is currently under review by the relevant authorities.

At this stage, no action is required from your side unless otherwise notified.

Our team is actively monitoring the progress to ensure timely processing. Any updates or additional requirements will be communicated to you promptly.

Thank you for your continued cooperation.

Kind regards,  
Simizi Support Team
"""

    # =========================
    # 3. IELTS
    # =========================
    elif stage.key == "ielts":
        subject = "IELTS Pre-Test Required – Next Step in Your Application"
        message = f"""
Dear {user.full_name},

We would like to inform you that your application has now reached the IELTS assessment stage, which is an important requirement in evaluating your eligibility for work authorization and immigration processing.

📌 Action Required  
Kindly complete the IELTS Express Pre-Test using the link below:  
https://careerwiseenglish.com.au/ielts-express-pre-test/

📌 After Completing the Test  
Please ensure you:  
• Complete the test carefully and honestly  
• Take note of your final score/result  
• Log in to your Simizi account: https://www.simizi.net  
• Upload or submit your IELTS pre-test result  

⏳ Important Note  
Timely completion and submission of your IELTS result is essential, as it directly impacts:  
• Your work permit application  
• Overall processing timeline  
• Final approval decision  

We strongly advise you to complete this step as soon as possible to avoid delays.

If you require any assistance, please contact our support team.

Kind regards,  
Simizi Support Team  
https://www.simizi.net
"""

    # =========================
    # 4. MEDICAL
    # =========================
    elif stage.key == "medical":
        subject = "Medical Examination Update – Action Required"
        message = f"""
Dear {user.full_name},

We would like to inform you that your application has now reached the Medical Examination stage.

📌 Action Required  

If you have already completed your medical examination:  
• Log in to your account: https://www.simizi.net  
• Upload your medical report  

If you have not yet completed the examination:  
• Log in to your account  
• Proceed to book your medical examination  
• Once booked, the company will handle the next steps  

⏳ Important Note  
Please complete or submit your medical report as soon as possible, as delays may affect your application processing timeline.

If you require any assistance, please contact our support team.

Kind regards,  
Simizi Support Team  
https://www.simizi.net
"""

    # =========================
    # 5. LMIA
    # =========================
    elif stage.key == "lmia":
        subject = "LMIA Application Update – In Progress"
        message = f"""
Dear {user.full_name},

We would like to inform you that your application has now progressed to the Labour Market Impact Assessment (LMIA) stage.

📌 Application Update  
The hiring company will now proceed with submitting your LMIA application to the relevant Canadian authorities.

📌 What to Expect  
• The LMIA will be reviewed by authorities  
• Once approved, you will be notified via email  
• You will log in to your account: https://www.simizi.net  
• Download your LMIA certificate from your dashboard  

📌 Important Note  
The LMIA is a critical requirement for your work permit and visa processing. Processing timelines may vary.

We will keep you updated.

If you require assistance, please contact our support team.

Kind regards,  
Simizi Support Team  
https://www.simizi.net
"""

    # =========================
    # 6. VISA PROCESSING
    # =========================
    elif stage.key == "visa_processing":
        subject = "Visa Application Under Processing"
        message = f"""
Dear {user.full_name},

We are pleased to inform you that your Visa Application is currently under processing.

All required documents have been submitted, and your application is being reviewed by immigration authorities.

At this stage:  
• No further action is required unless requested  
• Processing timelines may vary  

We will keep you informed of any updates or decisions.

Thank you for your cooperation.

Kind regards,  
Simizi Support Team
"""

    # =========================
    # SEND EMAIL
    # =========================
    if subject:
        send_mail(
            subject,
            message.strip(),
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )


# ================================
# 🚀 UPDATE STAGE VIEW
# ================================
class UpdateVisaStageView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            stage = VisaStage.objects.get(pk=pk)
        except VisaStage.DoesNotExist:
            return Response({"error": "Stage not found"}, status=404)

        user = request.user

        # ================================
        # 1️⃣ USER ACTIONS
        # ================================
        if stage.visa_application.application.applicant == user:

            # BIOMETRICS
            if stage.key == "biometrics" and "biometrics_booking_date" in request.data:
                stage.biometrics_booking_date = request.data["biometrics_booking_date"]
                stage.biometrics_status = "pending"
                stage.save()

                return Response({
                    "message": "Biometrics booked",
                    "date": stage.biometrics_booking_date
                })

            # MEDICAL
            if stage.key == "medical" and "medical_booking_date" in request.data:
                stage.medical_booking_date = request.data["medical_booking_date"]
                stage.save()

                return Response({
                    "message": "Medical booked",
                    "date": stage.medical_booking_date
                })

            return Response({"detail": "Not allowed"}, status=400)

        # ================================
        # 2️⃣ STAFF ONLY
        # ================================
        if not user.is_staff:
            raise PermissionDenied("Only staff allowed")

        # ================================
        # 🔴 DECISION FIRST
        # ================================
        if stage.key == "decision" and "decision_status" in request.data:
            decision = request.data["decision_status"]

            if decision == "approved":
                stage.status = "completed"
                stage.notes = "✅ Visa Approved"

            elif decision == "rejected":
                stage.status = "completed"
                stage.notes = "❌ Visa Rejected"

            stage.date_completed = timezone.now()
            stage.save()

            visa = stage.visa_application
            visa.current_stage = "decision"
            visa.save()

            return Response({"message": "Decision recorded"})

        # ================================
        # NORMAL STAFF UPDATES
        # ================================

        # Biometrics approve/decline
        if "biometrics_status" in request.data:
            stage.biometrics_status = request.data["biometrics_status"]

            if stage.biometrics_status == "approved":
                stage.status = "completed"
                stage.date_completed = timezone.now()

            elif stage.biometrics_status == "declined":
                stage.status = "in_progress"
                stage.notes = "Biometrics declined, please rebook."
                
                # IELTS
        if "ielts_status" in request.data:
            stage.ielts_status = request.data["ielts_status"]

            if stage.ielts_status == "approved":
                stage.notes = "IELTS results approved"

            elif stage.ielts_status == "rejected":
                stage.notes = "IELTS results rejected, user must re-upload"

        if "medical_booking_date" in request.data:
            stage.medical_booking_date = request.data["medical_booking_date"]

            # If admin sets new date → auto approve
            if request.user.is_staff:
                stage.medical_status = "approved"
                stage.status = "completed"
                stage.date_completed = timezone.now()
                stage.notes = f"📅 Medical scheduled for {stage.medical_booking_date}"
        
                # ================================
        # 🏥 MEDICAL LOGIC (FIX)
        # ================================
        if "medical_status" in request.data:
            stage.medical_status = request.data["medical_status"]

            if stage.medical_status == "approved":
                stage.status = "completed"
                stage.date_completed = timezone.now()
                stage.notes = "✅ Medical approved"

            elif stage.medical_status == "rejected":
                stage.status = "in_progress"
                stage.notes = "❌ Medical rejected. Please re-upload report."

        # Generic status
        if "status" in request.data:
            stage.status = request.data["status"]

            if stage.status == "completed":
                stage.date_completed = timezone.now()

        # Notes
        if "notes" in request.data:
            stage.notes = request.data["notes"]

        # ✅ SAVE FIRST
        stage.save()

        # ================================
        # 🟢 PROGRESSION + EMAIL (FIXED)
        # ================================
        if stage.status == "completed":

            # ✅ SEND EMAIL (FIXED HERE)
            # send_stage_email(stage)

            visa = stage.visa_application

            if stage.key == "decision":
                visa.current_stage = "decision"
            else:
                next_stage = VisaStage.objects.filter(
                    visa_application=visa,
                    order__gt=stage.order
                ).order_by("order").first()

                if next_stage:
                    visa.current_stage = next_stage.key
                    visa.save()

                    # ✅ SEND EMAIL FOR NEXT STAGE (THIS IS THE FIX)
                    send_stage_email(next_stage)

                else:
                    visa.current_stage = stage.key
                    visa.save()

            visa.save()

        return Response({"message": "Stage updated"})


# ================================
# 📂 UPLOAD
# ================================
class UploadVisaDocumentView(generics.CreateAPIView):
    serializer_class = VisaDocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            uploaded_by_admin=self.request.user.is_staff
        )


# ================================
# 📊 VISA VIEWSET
# ================================
class VisaApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VisaApplicationSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = VisaApplication.objects.prefetch_related("stages__uploads").order_by("-created_at")

        if user.is_staff:
            return queryset

        application_id = self.request.query_params.get("application_id")
        if application_id:
            queryset = queryset.filter(application__id=application_id)

        return queryset.filter(application__applicant=user)


# ================================
# ✅ VERIFY DOC
# ================================
class VerifyVisaDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            doc = VisaDocument.objects.get(pk=pk)
        except VisaDocument.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

        status_value = request.data.get("status")

        if status_value not in ["approved", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        doc.verification_status = status_value
        doc.save()

        return Response({"message": "Document updated"})