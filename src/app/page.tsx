"use client"

import { Button } from "@/components/button"
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useEffect, useState } from "react"

export default function Home() {
   const [query, setQuery] = useState("")
   const [searchResults, setSearchResults] = useState<{
      results: string[]
      duration: number
   }>()
   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
      setIsMounted(true)

      const fetchData = async () => {
         if (!query) return setSearchResults(undefined)

         const res = await fetch(
            `https://speed-search.souravsspace.workers.dev/api/search?q=${query}`
         )
         const data = (await res.json()) as {
            results: string[]
            duration: number
         }

         setSearchResults(data)
      }

      fetchData()
   }, [query])

   if (!isMounted) return null

   return (
      // <main className="h-screen w-screen grainy">
      <main className="h-screen w-screen">
         <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
            <h1 className="text-5xl tracking-tight font-bold">
               SpeedSearch ⚡
            </h1>
            <article className="text-muted-foreground text-lg max-w-prose text-center">
               A high-performance API built with Hono, Next.js and Cloudflare.{" "}
               <br /> Type a query below and get your results in miliseconds.
            </article>

            <div className="max-w-md w-full">
               <Dialog>
                  <DialogTrigger asChild>
                     <Button
                        variant="outline"
                        className="w-full flex items-center justify-between"
                     >
                        <h4>Search Country...</h4>

                        <Button
                           variant="secondary"
                           size="icon"
                           className="w-8 h-7 px-2.5"
                        >
                           <span className="text-xs">⌘ K</span>
                        </Button>
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                     <Command>
                        <CommandInput
                           value={query}
                           onValueChange={setQuery}
                           placeholder="Search countries..."
                           className="placeholder:text-zinc-500 dark:placeholder:text-zinc-300"
                        />

                        <CommandList>
                           {searchResults?.results.length === 0 ? (
                              <CommandEmpty>No results found</CommandEmpty>
                           ) : null}

                           {searchResults?.results ? (
                              <CommandGroup
                                 heading={`Results for '${query}'`}
                                 className="text-muted-foreground"
                              >
                                 {searchResults?.results.map((result) => (
                                    <CommandItem
                                       key={result}
                                       value={result}
                                       onSelect={setQuery}
                                    >
                                       {result}
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                           ) : null}

                           {searchResults?.results ? (
                              <>
                                 <div className="h-px w-full bg-zinc-200 dark:bg-zinc-400" />
                                 <article className="p-2 text-xs text-zinc-500 dark:text-zinc-300">
                                    Found {searchResults.results.length} results
                                    in {searchResults?.duration.toFixed(0)}ms
                                 </article>
                              </>
                           ) : null}
                        </CommandList>
                     </Command>
                  </DialogContent>
               </Dialog>
            </div>
         </div>
      </main>
   )
}
