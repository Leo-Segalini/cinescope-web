'use client'

import { useState, useCallback } from 'react'

interface FilterOption {
  id: number | string
  name: string
}

interface FilterComponentProps {
  title: string
  options: FilterOption[]
  selectedValues: (string | number)[]
  onChange: (values: (string | number)[]) => void
  className?: string
}

export const FilterComponent = ({
  title,
  options,
  selectedValues,
  onChange,
  className = '',
}: FilterComponentProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = useCallback((id: string | number) => {
    const newValues = selectedValues.includes(id)
      ? selectedValues.filter(value => value !== id)
      : [...selectedValues, id]
    onChange(newValues)
  }, [selectedValues, onChange])

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg bg-gray-800 px-4 py-2 text-white"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="filter-options"
      >
        <span className="font-medium">{title}</span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          id="filter-options"
          className="absolute z-10 mt-2 w-full rounded-lg bg-gray-800 p-2 shadow-lg"
          role="group"
          aria-label={`Liste des options pour ${title}`}
        >
          {options.map(option => (
            <div
              key={option.id}
              role="checkbox"
              aria-checked={selectedValues.includes(option.id)}
              className="flex cursor-pointer items-center rounded p-2 hover:bg-gray-700"
              onClick={() => handleToggle(option.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  handleToggle(option.id)
                }
              }}
              tabIndex={0}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
                checked={selectedValues.includes(option.id)}
                onChange={() => handleToggle(option.id)}
                aria-label={option.name}
                tabIndex={-1}
              />
              <span className="ml-2 text-white">{option.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 