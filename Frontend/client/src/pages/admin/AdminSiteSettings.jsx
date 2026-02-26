import { useEffect, useState } from "react"
import API from "../../api"
import toast from "react-hot-toast"

function AdminSiteSettings() {

  const [settings, setSettings] = useState({
    whatsapp_link: "",
    is_whatsapp_active: false
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await API.get("site-settings/")
      const data = res.data.results || res.data
      if (Array.isArray(data)) {
        setSettings(data[0] || {})
      } else {
        setSettings(data)
      }
    } catch (err) {
      toast.error("Failed to load settings")
    }
  }

 const handleSave = async () => {
  console.log("Saving settings:", settings)

  if (!settings?.id) {
    console.error("No settings ID found")
    toast.error("Settings ID missing.")
    return
  }

  try {
    await API.patch(`site-settings/${settings.id}/`, settings)
    toast.success("WhatsApp settings updated")
  } catch (err) {
    console.error("PATCH ERROR:", err.response?.data)
    toast.error(JSON.stringify(err.response?.data))
  }
}

  return (
    <div>
      <h3>Site Settings</h3>

      <input
        value={settings.whatsapp_link}
        placeholder="WhatsApp Link"
        onChange={(e) =>
          setSettings({ ...settings, whatsapp_link: e.target.value })
        }
      />

      <label>
        Active
        <input
          type="checkbox"
          checked={settings.is_whatsapp_active}
          onChange={(e) =>
            setSettings({ ...settings, is_whatsapp_active: e.target.checked })
          }
        />
      </label>

      <button onClick={handleSave}>
        Save Settings
      </button>
    </div>
  )
}

export default AdminSiteSettings