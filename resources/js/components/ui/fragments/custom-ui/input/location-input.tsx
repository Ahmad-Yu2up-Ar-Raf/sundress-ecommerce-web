import React, { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/fragments/shadcn-ui/scroll-area'
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/fragments/shadcn-ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/fragments/shadcn-ui/popover'
import { cn } from '@/lib/utils'

// Import JSON data directly
import countries from '@/config/data/countries.json'
import states from '@/config/data/states.json'

interface Timezone {
  zoneName: string
  gmtOffset: number
  gmtOffsetName: string
  abbreviation: string
  tzName: string
}

export interface CountryProps {
  id: number
  name: string
  iso3: string
  iso2: string
  numeric_code: string
  phone_code: string
  capital: string
  currency: string
  currency_name: string
  currency_symbol: string
  tld: string
  native: string
  region: string
  region_id: string
  subregion: string
  subregion_id: string
  nationality: string
  timezones: Timezone[]
  translations: Record<string, string>
  latitude: string
  longitude: string
  emoji: string
  emojiU: string
}

export interface StateProps {
  id: number
  name: string
  country_id: number
  country_code: string
  country_name: string
  state_code: string
  type: string | null
  latitude: string
  longitude: string
}

// ==================== COUNTRY SELECTOR ====================
interface CountrySelectorProps {
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  onCountrySelect?: (country: CountryProps | null) => void
}

export const CountrySelector = ({
  disabled,
  value,
  onChange,
  onCountrySelect,
}: CountrySelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(null)
  const [openDropdown, setOpenDropdown] = useState(false)

  const countriesData = countries as CountryProps[]

  // Initialize from value prop
  useEffect(() => {
    
    
    if (value) {
      const country = countriesData.find(c => c.name === value)
   
      
      if (country && (!selectedCountry || selectedCountry.name !== value)) {
        setSelectedCountry(country)
        onCountrySelect?.(country)
      }
    }
  }, [value])

  const handleSelect = (country: CountryProps) => {
 
    setSelectedCountry(country)
    onChange?.(country.name)
    onCountrySelect?.(country)
    setOpenDropdown(false)
  }

  return (
    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          type="button"
          aria-expanded={openDropdown}
          disabled={disabled}
          className="w-full justify-between h-10"
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-base">{selectedCountry.emoji}</span>
              <span className="truncate text-sm">{selectedCountry.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Select Country...</span>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-[--radix-popover-trigger-width] min-w-[300px]"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[300px]">
                {countriesData.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={country.name}
                    onSelect={() => handleSelect(country)}
                    className="flex cursor-pointer items-center justify-between text-sm py-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-base">{country.emoji}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0 ml-2',
                        selectedCountry?.id === country.id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ==================== PROVINCE/STATE SELECTOR ====================
interface ProvinceSelectorProps {
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  countryName?: string
  onProvinceSelect?: (province: StateProps | null) => void
}

export const ProvinceSelector = ({
  disabled = false,
  value,
  onChange,
  countryName,
  onProvinceSelect,
}: ProvinceSelectorProps) => {
  const [selectedProvince, setSelectedProvince] = useState<StateProps | null>(null)
  const [openDropdown, setOpenDropdown] = useState(false)

  const countriesData = countries as CountryProps[]
  const statesData = states as StateProps[]


  // Find country by name
  const selectedCountry = countryName 
    ? countriesData.find(c => c.name === countryName)
    : null



  // DEBUG: Check first few states to see the structure
  if (statesData.length > 0) {
  
    
    // Try to find ANY state that matches
    const matchingStates = statesData.filter(state => {
    
      return state.country_id === selectedCountry?.id
    }).slice(0, 5) // Only log first 5 matches
    
    
  }

  // Filter provinces for selected country - FIXED: Handle type mismatch
  const availableProvinces = selectedCountry
    ? statesData.filter((state) => {
        // Handle both string and number comparison
        const stateCountryId = state.country_id 
        const selectedCountryId = selectedCountry.id
        
        // Compare as both string and number
        return stateCountryId == selectedCountryId || 
               Number(stateCountryId) === Number(selectedCountryId) ||
               String(stateCountryId) === String(selectedCountryId)
      })
    : []


  if (availableProvinces.length > 0) {

  }

  const hasProvinces = availableProvinces.length > 0

  // SIMPLIFIED DISABLED LOGIC - JUST CHECK IF WE HAVE PROVINCES
  const isButtonDisabled = disabled || !hasProvinces



  // Initialize from value prop
  useEffect(() => {
    if (value && availableProvinces.length > 0) {
      const province = availableProvinces.find(p => p.name === value)
      if (province && (!selectedProvince || selectedProvince.name !== value)) {
        setSelectedProvince(province)
      }
    }
  }, [value, availableProvinces.length])

  // Reset province when country changes
  useEffect(() => {
    if (selectedCountry && selectedProvince?.country_id !== selectedCountry.id) {
   
      setSelectedProvince(null)
      onChange?.('')
      onProvinceSelect?.(null)
    }
  }, [selectedCountry?.id])

  const handleSelect = (province: StateProps) => {
    
    setSelectedProvince(province)
    onChange?.(province.name)
    onProvinceSelect?.(province)
    setOpenDropdown(false)
  }

  return (
    <div className="w-full">
      <Popover 
        open={openDropdown} 
        onOpenChange={setOpenDropdown}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            aria-expanded={openDropdown}
            disabled={isButtonDisabled}
            className={cn(
              "w-full justify-between h-10",
              isButtonDisabled && "cursor-not-allowed opacity-50"
            )}
          >
            {selectedProvince ? (
              <span className="truncate text-sm">{selectedProvince.name}</span>
            ) : (
              <span className="text-muted-foreground text-sm">
                {!countryName 
                  ? "Select country first..." 
                  : !hasProvinces 
                  ? "No provinces available" 
                  : "Select Province..."}
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        {hasProvinces && (
          <PopoverContent 
            className="p-0 w-[--radix-popover-trigger-width] min-w-[300px]"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <Command>
              <CommandInput placeholder="Search province..." className="h-9" />
              <CommandList>
                <CommandEmpty>No province found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {availableProvinces.map((province) => (
                      <CommandItem
                        key={province.id}
                        value={province.name}
                        onSelect={() => handleSelect(province)}
                        className="flex cursor-pointer items-center justify-between text-sm py-2"
                      >
                        <span className="truncate flex-1 min-w-0">{province.name}</span>
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0 ml-2',
                            selectedProvince?.id === province.id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      
     
    </div>
  )
}