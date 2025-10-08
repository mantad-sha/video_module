'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  id?: string
  'aria-label'?: string
  className?: string
}

export default function Select({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select an option...', 
  disabled = false,
  id,
  'aria-label': ariaLabel,
  className = ''
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  // Reset highlighted index when menu opens
  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex(opt => opt.value === value)
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
    }
  }, [isOpen, value, options])

  // Close on click outside
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
          const option = options[highlightedIndex]
          if (!option.disabled) {
            onChange(option.value)
            setIsOpen(false)
          }
        } else {
          setIsOpen(true)
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
          let nextIndex = highlightedIndex + 1
          while (nextIndex < options.length && options[nextIndex].disabled) {
            nextIndex++
          }
          if (nextIndex < options.length) {
            setHighlightedIndex(nextIndex)
          } else {
            // Wrap to start
            let firstEnabled = 0
            while (firstEnabled < options.length && options[firstEnabled].disabled) {
              firstEnabled++
            }
            if (firstEnabled < options.length) {
              setHighlightedIndex(firstEnabled)
            }
          }
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          let prevIndex = highlightedIndex - 1
          while (prevIndex >= 0 && options[prevIndex].disabled) {
            prevIndex--
          }
          if (prevIndex >= 0) {
            setHighlightedIndex(prevIndex)
          } else {
            // Wrap to end
            let lastEnabled = options.length - 1
            while (lastEnabled >= 0 && options[lastEnabled].disabled) {
              lastEnabled--
            }
            if (lastEnabled >= 0) {
              setHighlightedIndex(lastEnabled)
            }
          }
        }
        break

      case 'Home':
        if (isOpen) {
          e.preventDefault()
          let firstEnabled = 0
          while (firstEnabled < options.length && options[firstEnabled].disabled) {
            firstEnabled++
          }
          if (firstEnabled < options.length) {
            setHighlightedIndex(firstEnabled)
          }
        }
        break

      case 'End':
        if (isOpen) {
          e.preventDefault()
          let lastEnabled = options.length - 1
          while (lastEnabled >= 0 && options[lastEnabled].disabled) {
            lastEnabled--
          }
          if (lastEnabled >= 0) {
            setHighlightedIndex(lastEnabled)
          }
        }
        break

      default:
        // Type-ahead functionality
        if (isOpen && e.key.length === 1) {
          const char = e.key.toLowerCase()
          const startIndex = highlightedIndex + 1
          const orderedOptions = [...options.slice(startIndex), ...options.slice(0, startIndex)]
          const matchIndex = orderedOptions.findIndex(opt => 
            !opt.disabled && opt.label.toLowerCase().startsWith(char)
          )
          
          if (matchIndex !== -1) {
            const actualIndex = (startIndex + matchIndex) % options.length
            setHighlightedIndex(actualIndex)
          }
        }
        break
    }
  }

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return
    onChange(option.value)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button - Dark themed to match UI */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full min-h-[44px] px-4 py-2.5 pr-10
          glass-input text-left text-white
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-activedescendant={isOpen && highlightedIndex >= 0 ? `option-${options[highlightedIndex].value}` : undefined}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu - Light themed for readability */}
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-[60] mt-1 w-full bg-white text-black border border-gray-200 rounded-lg shadow-xl ring-1 ring-black/5 max-h-60 overflow-auto focus:outline-none"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isHighlighted = index === highlightedIndex
            const isDisabled = option.disabled

            return (
              <li
                key={option.value}
                id={`option-${option.value}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                className={`
                  relative select-none px-3 py-2 pl-10 pr-4 cursor-pointer text-black
                  ${isHighlighted && !isDisabled ? 'bg-gray-100' : 'bg-white'}
                  ${isSelected ? 'font-semibold bg-gray-200' : 'font-normal'}
                  ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}
                  ${!isDisabled ? 'focus:bg-gray-100 focus:outline-none' : ''}
                  transition-colors duration-150
                `}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => !isDisabled && setHighlightedIndex(index)}
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
