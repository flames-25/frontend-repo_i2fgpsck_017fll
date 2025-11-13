import { useEffect, useState } from 'react'
import ProjectCard from './components/ProjectCard'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [activeProject, setActiveProject] = useState(null)

  const [newProject, setNewProject] = useState({
    title: '',
    founder_name: '',
    founder_email: '',
    description: '',
    category: 'AI',
    goal_amount: 0,
    featured: false,
  })

  const [donation, setDonation] = useState({
    donor_name: '',
    amount: 10,
    message: ''
  })

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`)
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const submitProject = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      })
      if (!res.ok) throw new Error('Failed to create project')
      setShowForm(false)
      setNewProject({ title: '', founder_name: '', founder_email: '', description: '', category: 'AI', goal_amount: 0, featured: false })
      fetchProjects()
    } catch (e) {
      setError(e.message)
    }
  }

  const openDonate = (project) => {
    setActiveProject(project)
  }

  const submitDonation = async (e) => {
    e.preventDefault()
    if (!activeProject) return
    setError('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...donation, project_id: activeProject.id })
      })
      if (!res.ok) throw new Error('Failed to donate')
      setActiveProject(null)
      setDonation({ donor_name: '', amount: 10, message: '' })
      fetchProjects()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 backdrop-blur bg-white/70 border-b border-slate-200 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
            <span className="font-bold text-xl text-slate-900">Moonshot Fund</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800">Submit Project</button>
            <a href="/test" className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-white">Status</a>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Fund the next wave of bold ideas</h1>
          <p className="mt-3 text-slate-600">We back builders working on ambitious problems. Start with AI credits today — and as we grow, we’ll support projects in climate, bio, and beyond.</p>
        </div>

        {error && (
          <div className="mt-6 rounded-md bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="mt-10 text-slate-600">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onDonate={openDonate} />
            ))}
          </div>
        )}
      </section>

      {/* Submit Project Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Submit your project</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={submitProject} className="space-y-3">
              <input className="w-full border rounded-md px-3 py-2" placeholder="Project title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <input className="w-full border rounded-md px-3 py-2" placeholder="Founder name" value={newProject.founder_name} onChange={e => setNewProject({ ...newProject, founder_name: e.target.value })} required />
                <input className="w-full border rounded-md px-3 py-2" placeholder="Founder email" type="email" value={newProject.founder_email} onChange={e => setNewProject({ ...newProject, founder_email: e.target.value })} required />
              </div>
              <textarea className="w-full border rounded-md px-3 py-2" rows={4} placeholder="What are you building?" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <select className="w-full border rounded-md px-3 py-2" value={newProject.category} onChange={e => setNewProject({ ...newProject, category: e.target.value })}>
                  <option>AI</option>
                  <option>Climate</option>
                  <option>Biotech</option>
                  <option>Robotics</option>
                  <option>Other</option>
                </select>
                <input className="w-full border rounded-md px-3 py-2" placeholder="Goal (USD)" type="number" min="0" value={newProject.goal_amount} onChange={e => setNewProject({ ...newProject, goal_amount: Number(e.target.value) })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={newProject.featured} onChange={e => setNewProject({ ...newProject, featured: e.target.checked })} />
                Mark as featured
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-white">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donate Modal */}
      {activeProject && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Donate to {activeProject.title}</h3>
              <button onClick={() => setActiveProject(null)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={submitDonation} className="space-y-3">
              <input className="w-full border rounded-md px-3 py-2" placeholder="Your name" value={donation.donor_name} onChange={e => setDonation({ ...donation, donor_name: e.target.value })} required />
              <input className="w-full border rounded-md px-3 py-2" placeholder="Amount (USD)" type="number" min="1" value={donation.amount} onChange={e => setDonation({ ...donation, amount: Number(e.target.value) })} required />
              <textarea className="w-full border rounded-md px-3 py-2" rows={3} placeholder="Message (optional)" value={donation.message} onChange={e => setDonation({ ...donation, message: e.target.value })} />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveProject(null)} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-white">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Donate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600">
          Built for bold builders. Start with AI credits today; new categories coming soon.
        </div>
      </footer>
    </div>
  )
}

export default App
