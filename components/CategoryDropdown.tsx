'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown, Check } from 'lucide-react'

interface CategoryOption {
  value: string
  label: string
}

interface CategoryDropdownProps {
  value: string
  onChange: (value: string) => void
  options: CategoryOption[]
  disabled?: boolean
}

export default function CategoryDropdown({ value, onChange, options, disabled = false }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  useEffect(() => {
    if (isOpen && highlightedIndex === -1) {
      const currentIndex = options.findIndex(opt => opt.value === value)
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
    }
  }, [isOpen, value, options, highlightedIndex])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value)
          setIsOpen(false)
        } else {
          setIsOpen(!isOpen)
        }
        break

      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
        break

      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          )
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          )
        }
        break

      case 'Home':
        if (isOpen) {
          e.preventDefault()
          setHighlightedIndex(0)
        }
        break

      case 'End':
        if (isOpen) {
          e.preventDefault()
          setHighlightedIndex(options.length - 1)
        }
        break

      default:
        // Type-ahead functionality
        if (isOpen && e.key.length === 1) {
          const char = e.key.toLowerCase()
          const startIndex = highlightedIndex + 1
          const matchIndex = [...options.slice(startIndex), ...options.slice(0, startIndex)]
            .findIndex(opt => opt.label.toLowerCase().startsWith(char))
          
          if (matchIndex !== -1) {
            const actualIndex = (startIndex + matchIndex) % options.length
            setHighlightedIndex(actualIndex)
          }
        }
        break
    }
  }

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div ref={dropdownRef} className="relative sm:w-64">
      <label htmlFor="category-filter" className="sr-only">
        Filter by category
      </label>
      
      {/* Trigger Button - Dark themed */}
      <button
        ref={buttonRef}
        id="category-filter"
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full min-h-[44px] px-4 py-2.5 pl-12 pr-10
          glass-input text-left
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="category-filter-label"
        aria-describedby="category-hint"
      >
        <Filter 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" 
          aria-hidden="true"
        />
        <span className="block truncate">{selectedOption.label}</span>
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <span id="category-hint" className="sr-only">
        Press C for quick access to category filter
      </span>

      {/* Dropdown Menu - Light themed */}
      {isOpen && (
        <ul
          ref={menuRef}
          className="absolute z-[60] mt-1 w-full bg-white text-black border border-gray-200 rounded-lg shadow-xl ring-1 ring-black/5 max-h-60 overflow-auto focus:outline-none"
          role="listbox"
          aria-labelledby="category-filter"
          aria-activedescendant={highlightedIndex >= 0 ? `category-option-${options[highlightedIndex].value}` : undefined}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isHighlighted = index === highlightedIndex

            return (
              <li
                key={option.value}
                id={`category-option-${option.value}`}
                role="option"
                aria-selected={isSelected}
                className={`
                  relative select-none px-3 py-2 pl-10 pr-4 cursor-pointer text-black
                  ${isHighlighted ? 'bg-gray-100' : 'bg-white'}
                  ${isSelected ? 'font-semibold bg-gray-200' : 'font-normal'}
                  ${disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}
                  focus:bg-gray-100 focus:outline-none
                  transition-colors duration-150
                `}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {isSelected && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                    <Check className="w-5 h-5" aria-hidden="true" />
                  </span>
                )}
                <span className="block truncate">{option.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
