'use client'

import { AIOperationProvider } from './AIOperationProvider'

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
          <AIOperationProvider>
            {children}
          </AIOperationProvider>AIOperationProvider>
        )
}
</AIOperationProvider>
