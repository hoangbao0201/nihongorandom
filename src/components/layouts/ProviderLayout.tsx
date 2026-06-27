"use client"

import NextTopLoader from "nextjs-toploader"
import { useEffect } from "react"
import SiteHeader from "@/src/components/layouts/SiteHeader"
import OnlineCount from "@/src/components/shared/OnlineCount"
import { preloadJapaneseSpeech } from "@/src/lib/japaneseSpeechEngine"

const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        preloadJapaneseSpeech()
    }, [])

    return (
        <>
            <NextTopLoader
                color="#f94300"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
            />
            <SiteHeader />
            <OnlineCount />
            {children}
        </>
    )
}

export default ProviderLayout;