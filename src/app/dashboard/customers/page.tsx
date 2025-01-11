import { lusitana } from '@/app/ui/fonts';

export const metadata = {
  title: 'Customers',
}

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Customer&apos;s Page
      </h1>
    </main>
  )
}