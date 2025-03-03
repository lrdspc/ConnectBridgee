import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateInput: Date | string, formatString: string = "dd/MM/yyyy"): string {
  try {
    // Handle Date objects directly
    if (dateInput instanceof Date) {
      return format(dateInput, formatString, { locale: ptBR })
    }
    
    // Handle string inputs
    if (typeof dateInput === 'string') {
      // Check if the date is in ISO format
      if (dateInput.includes("T") || dateInput.includes("-")) {
        const date = new Date(dateInput)
        return format(date, formatString, { locale: ptBR })
      }
      
      // If it's in dd/MM/yyyy format already
      const parsedDate = parse(dateInput, "dd/MM/yyyy", new Date())
      return format(parsedDate, formatString, { locale: ptBR })
    }
    
    return String(dateInput) // Fallback for unexpected inputs
  } catch (error) {
    console.error("Error formatting date:", error)
    return String(dateInput) // Return original input as string if formatting fails
  }
}

export function formatTime(timeString: string | undefined): string {
  if (!timeString) return ""
  return timeString
}

export function formatDateTime(dateInput: Date | string, timeString?: string): string {
  const formattedDate = formatDate(dateInput)
  return timeString ? `${formattedDate} às ${timeString}` : formattedDate
}
