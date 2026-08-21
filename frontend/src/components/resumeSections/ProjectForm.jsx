import { Plus, Trash2, Sparkles, FolderGit2, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import api from '../../configs/api'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const ProjectForm = ({ data, onChange }) => {
  const { token } = useSelector(state => state.auth)
  const [generatingIdx, setGeneratingIdx] = useState(-1)

  const enhanceDescription = async (idx) => {
    try {
      setGeneratingIdx(idx)
      const project = data[idx]
      const prompt = `Enhance this project description - "${project.description}" for the ${project.name} built using ${project.tech_stack}`
      const res = await api.post('/api/ai/enhance-project-desc', { prompt }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      updateProject(idx, "description", res.data.enhancedDescription)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setGeneratingIdx(-1)
    }
  }

  const addProject = () => {
    const newProject = {
      name: '',
      tech_stack: '',
      description: '',
      link: ''
    }
    onChange([...data, newProject])
  }
  const removeProject = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Project?')
    if (!confirmDelete) return
    const updatedData = data.filter((_, i) => index !== i)
    onChange(updatedData)
  }
  const updateProject = (index, field, value) => {
    const updatedData = [...data]
    updatedData[index] = { ...updatedData[index], [field]: value }
    onChange(updatedData)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
          <p className='text-sm text-gray-500'>Add your Projects here</p>
        </div>
        <button onClick={addProject} className='flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg
        hover:bg-green-700 transition-colors'>
          <Plus className='size-4' />Add Project
        </button>
      </div>
      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <FolderGit2 className='w-12 h-12 mx-auto mb-3 text-gray-300' />
          <p>Projects not added yet.</p>
          <p className='text-sm'>Click "Add Project" to start building your resume.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((project, index) => (
            <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
              <div className='flex justify-between items-start'>
                <h4>Project #{index + 1}</h4>
                <button onClick={() => removeProject(index)} className='text-red-500 p-2.5 rounded-full hover:bg-red-200
                hover:text-red-700 transition-colors'>
                  <Trash2 className='size-5' />
                </button>
              </div>

              {/*Input for Project Details */}
              <div className='grid md:grid-cols-2 gap-3'>
                <input type="text" value={project.name || ""} onChange={(e) => updateProject(index, 'name', e.target.value)}
                  placeholder='Project Name' className='px-3 py-2 text-sm rounded-lg' />
                <input type="text" value={project.tech_stack || ""} onChange={(e) => updateProject(index, 'tech_stack', e.target.value)}
                  placeholder='Tech Stack' className='px-3 py-2 text-sm rounded-lg' maxLength={75} />
              </div>
              <div className='grid md:grid-cols-1'>
                <input type='url' value={project.link || ''} onChange={(e) => updateProject(index, 'link', e.target.value)}
                  placeholder='Project Link' className='px-3 py-2 text-sm rounded-lg'
                />
              </div>
              <div className='space-y-3 mt-3'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-gray-700'>Project Description</label>
                  <button onClick={() => enhanceDescription(index)} disabled={generatingIdx === index || !project.name || !project.description} className='flex items-center gap-1
                   px-2 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                    {generatingIdx === index ? (<Loader2 className='animate-spin size-4' />) : (<Sparkles className='size-4' />)}
                    {generatingIdx === index ? "Enhancing..." : "AI Enhance"}
                  </button>
                </div>
                <textarea rows={5} value={project.description || ''} onChange={(e) => updateProject(index, 'description', e.target.value)}
                  className='w-full text-sm px-3 py-2 rounded-lg resize-none' placeholder='Describe about project and your key responsibilities while Developing...' />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectForm