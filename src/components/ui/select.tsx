'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Search } from 'lucide-react'
import { cn } from '../../lib/utils'

const SelectContext = React.createContext<{
  searchTerm: string
  setSearchTerm: (val: string) => void
  isSearchable: boolean
  setIsSearchable: (val: boolean) => void
  visibleItemsCount: number
  setVisibleItemsCount: React.Dispatch<React.SetStateAction<number>>
} | null>(null)

function Select({
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isSearchable, setIsSearchable] = React.useState(false)
  const [visibleItemsCount, setVisibleItemsCount] = React.useState(0)

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSearchTerm('')
      setVisibleItemsCount(0)
    }
    props.onOpenChange?.(open)
  }

  return (
    <SelectContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      isSearchable, 
      setIsSearchable,
      visibleItemsCount,
      setVisibleItemsCount
    }}>
      <SelectPrimitive.Root data-slot="select" {...props} onOpenChange={onOpenChange}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-white/40 shadow-sm outline-none",
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-11',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 line-clamp-1">
        {children}
      </div>
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-40 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  searchable = false,
  searchPlaceholder = "Search...",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  searchable?: boolean
  searchPlaceholder?: string
}) {
  const context = React.useContext(SelectContext)
  
  React.useEffect(() => {
    if (context) {
      context.setIsSearchable(searchable)
    }
  }, [searchable, context])

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'relative z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-white/10 bg-background/95 text-white shadow-2xl backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        
        {searchable && context && (
          <div 
            className="flex items-center border-b border-white/5 px-3 py-3 sticky top-0 bg-background/50 backdrop-blur-sm z-20 cursor-text"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => {
              const input = document.querySelector('input[data-select-search]');
              if (input instanceof HTMLInputElement) input.focus();
            }}
          >
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-40" />
            <input
              data-select-search
              className="flex h-6 w-full bg-transparent text-sm outline-none placeholder:text-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={searchPlaceholder}
              value={context.searchTerm}
              onChange={(e) => context.setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') e.stopPropagation()
              }}
              onFocus={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
        )}

        <SelectPrimitive.Viewport
          className={cn(
            'p-1.5',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white/30', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  textValue,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const context = React.useContext(SelectContext)
  
  const shouldShow = React.useMemo(() => {
    if (!context || !context.searchTerm) return true
    
    const searchValue = (textValue || (typeof children === 'string' ? children : '')).toLowerCase()
    return searchValue.includes(context.searchTerm.toLowerCase())
  }, [context, children, textValue])

  if (!shouldShow) return null

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-xl py-2.5 pl-3 pr-9 text-sm outline-none transition-all hover:bg-white/5 focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group font-medium",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4 text-primary" strokeWidth={3} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-white/5 pointer-events-none -mx-1.5 my-1.5 h-px', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-white/40',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-white/40',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
