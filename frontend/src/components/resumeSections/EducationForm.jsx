import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import React from 'react'

const EducationForm = ({ data, onChange }) => {
    const addEducation = () => {
        const newEducation = {
            institution: '',
            degree: '',
            field_of_study: '',
            score: '',
            start_date: '',
            graduation_date: '',
            is_current: false
        }
        onChange([...data, newEducation])
    }
    const removeEducation = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this education?')
        if (!confirmDelete) return
        const updatedEducation = data.filter((_, i) => i !== index)
        onChange(updatedEducation)
    }
    const updateEducation = (index, field, value) => {
        const updatedEducation = [...data]
        updatedEducation[index] = { ...updatedEducation[index], [field]: value }
        onChange(updatedEducation)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Education</h3>
                    <p className='text-sm text-gray-500'>Add your Education details here</p>
                </div>
                <button onClick={addEducation} className='flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg
                hover:bg-green-700 transition-colors'>
                    <Plus className='size-4' />Add Education
                </button>
            </div>
            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <GraduationCap className='w-14 h-14 mx-auto mb-2 text-gray-300' />
                    <p>Education details not added yet.</p>
                    <p className='text-sm'>Click "Add Education" to start building your resume.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((education, index) => (
                        <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                            <div className='flex justify-between items-start'>
                                <h4>Education #{index + 1}</h4>
                                <button onClick={() => removeEducation(index)} className='text-red-500 p-2.5 rounded-full hover:bg-red-200
                                    hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-5' />
                                </button>
                            </div>

                            {/* Input for Education Details */}
                            <div className='grid md:grid-cols-2 gap-3 mb-1'>
                                <input type="text" value={education.institution || ""} onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                    placeholder='Institute Name' className='px-3 py-2 text-sm rounded-lg' />
                                <input type="text" value={education.degree || ""} onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                    placeholder='Degree' className='px-3 py-2 text-sm rounded-lg' />
                                <input type="text" value={education.field_of_study || ""} onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                                    placeholder='Field of Study' className='px-3 py-2 text-sm rounded-lg' />
                                <input type="number" step="0.01" min="0" max="10" value={education.score || ""} className='px-3 py-2 text-sm rounded-lg'
                                    onChange={(e) => updateEducation(index, 'score', e.target.value)} placeholder='Score' />
                                <input type="month" value={education.start_date || ""} onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    className='px-3 py-2 text-sm rounded-lg cursor-pointer' />
                                <input type="month" value={education.is_current ? "" : education.graduation_date} onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    className='px-3 py-2 text-sm rounded-lg cursor-pointer disabled:bg-gray-100' disabled={education.is_current} />
                            </div>
                            <label className='flex items-center gap-1'>
                                <input type="checkbox" checked={education.is_current} onChange={(e) => updateEducation(index, 'is_current', e.target.checked)} />
                                <span className='text-sm text-gray-700'>Currently studying here</span>
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EducationForm