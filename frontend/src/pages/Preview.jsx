import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import api from '../configs/api'

const Preview = () => {
  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resume/view/' + resumeId);
      setResumeData(data.resume)
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResume()
  }, [])

  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
      </div>
    </div>
  ) : (
    <div>
      {loading ? <Loader /> :
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>Resume Not Found</h2>
          <p className='text-gray-500'>The resume you are looking for does not exist or has been removed.</p>
        </div>
      }
    </div>
  )
}

export default Preview