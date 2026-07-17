import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, Share2Icon } from 'lucide-react'
import PersonalDataForm from '../components/resumeSections/PersonalDataForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import SummaryForm from '../components/resumeSections/SummaryForm'
import ExperienceForm from '../components/resumeSections/ExperienceForm'
import EducationForm from '../components/resumeSections/EducationForm'
import ProjectForm from '../components/resumeSections/ProjectForm'
import SkillsForm from '../components/resumeSections/SkillsForm'
import CertificationsForm from '../components/resumeSections/CertificationsForm'
import AchievementsForm from '../components/resumeSections/AchievementsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
  const { token } = useSelector(state => state.auth)
  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    projects: [],
    education: [],
    skills: {
      languages: [],
      development: [],
      cloud: [],
      tools: [],
    },
    certifications: [],
    achievements: [],
    template: 'classic',
    accent_color: '#000000',
    public: false,
  })
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = ['personal', 'summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements']

  const existingResume = async () => {
    try {
      const { data } = await api.get(`/api/resume/get/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title
      }
    } catch (err) {
      console.log(err.message)
      toast.error("Failed to sync resume data")
    }
  }

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify({ public: !resumeData.public }))
      const { data } = await api.put(`/api/resume/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (err) {
      console.log(err.message)
    }
  }

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData)
      // remove img from updatedResumeData
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

      const { data } = await api.put('/api/resume/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setResumeData(data.resume)
      return data;
    } catch (err) {
      throw err;
    }
  }

  const handleShare = async () => {
    const frontendURL = window.location.href.split('/app/')[0]
    const resumeURL = `${frontendURL}/view/${resumeData._id}`
    if (navigator.share) {
      navigator.share({ url: resumeURL, title: resumeData.title })
    } else {
      alert('Sharing not supported on this browser. Copy this link to share: ' + resumeURL)
    }
  }

  useEffect(() => {
    existingResume()
  }, [])

  return (
    <div>
      <div className='max-w-8xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-1 items-center text-slate-500 hover:text-slate-700 transition-colors'>
          <ArrowLeftIcon className='size-5' /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-8xl mx-auto px-18 pb-8'>
        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIdx */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr className='absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none
                 transition-discrete duration-2000' style={{ width: `${activeSectionIdx * 100 / (sections.length - 1)}%` }} />

              {/* Section Navigation */}
              <div className='flex justify-between items-center border-b border-gray-300 py-2 mb-3'>

                {/* Buttons for Template and Color */}
                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                </div>

                <div className='flex items-center'>
                  {activeSectionIdx > 0 && (
                    <button onClick={() => setActiveSectionIdx((prev) => Math.max(prev - 1, 0))} className='flex items-center gap-1 p-2.5 rounded-lg
                     text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all'>
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}
                  <button onClick={() => setActiveSectionIdx((prev) => Math.min(prev + 1, sections.length - 1))} className={`flex items-center
                    gap-1 p-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all
                    ${activeSectionIdx === sections.length - 1 ? 'opacity-50' : ''}`} disabled={activeSectionIdx === sections.length - 1}>
                    Next <ChevronRight className='size-4' />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className='space-y-6'>
                {sections[activeSectionIdx] === 'personal' && (
                  <PersonalDataForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({
                    ...prev,
                    personal_info: data
                  }))} template={resumeData.template} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {sections[activeSectionIdx] === 'summary' && (
                  <SummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />
                )}
                {sections[activeSectionIdx] === 'experience' && (
                  <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />
                )}
                {sections[activeSectionIdx] === 'education' && (
                  <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                )}
                {sections[activeSectionIdx] === 'projects' && (
                  <ProjectForm data={resumeData.projects} onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))} />
                )}
                {sections[activeSectionIdx] === 'skills' && (
                  <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                )}
                {sections[activeSectionIdx] === 'certifications' && (
                  <CertificationsForm data={resumeData.certifications || []} onChange={(data) => setResumeData(prev => ({ ...prev, certifications: data }))} />
                )}
                {sections[activeSectionIdx] === 'achievements' && (
                  <AchievementsForm data={resumeData.achievements || []} onChange={(data) => setResumeData(prev => ({ ...prev, achievements: data }))} />
                )}
              </div>
              <button onClick={() =>
                toast.promise(saveResume(), {
                  loading: 'Saving...',
                  success: (data) => data.message,
                  error: (err) =>
                    err?.response?.data?.message || err.message
                })
              } className='bg-green-500 ring ring-green-400 hover:ring-green-700
               hover:bg-green-600 transition-colors rounded-lg px-4 py-2 mt-6 text-sm text-white'>Save Changes</button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-sm bg-linear-to-br from-blue-100 to-blue-200
                    text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4' />Share
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-sm bg-linear-to-br from-purple-100 to-purple-200
                  text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button onClick={() => window.print()} className='flex items-center p-2 px-4 gap-2 text-sm bg-linear-to-br from-green-100 to-green-200
                  text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                  <DownloadIcon className='size-4' />Download
                </button>
              </div>
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder