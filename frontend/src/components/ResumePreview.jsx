import React from 'react'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalTemplate from './templates/MinimalTemplate.jsx'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const templateRegistry = {
  'classic': ClassicTemplate,
  'modern': ModernTemplate,
  'minimal': MinimalTemplate,
  'minimal-image': MinimalImageTemplate,
}

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const SelectedTemplate = templateRegistry[template] || ClassicTemplate

  return (
    <div className='w-full bg-gray-100'>
      <div id='resume-preview' className={`border border-gray-200 print:shadow-none print:border-none ${classes}`}>
        <SelectedTemplate data={data} accentColor={accentColor} />
      </div>
      <style>{`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ResumePreview