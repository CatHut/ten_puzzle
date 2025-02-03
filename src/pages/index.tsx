import type { NextPage } from 'next'
import Head from 'next/head'
import { TenPuzzle } from '@/components/ten-puzzle'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>10パズル</title>
        <meta name="description" content="数字を組み合わせて10を作るパズルゲーム" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <TenPuzzle />
        </div>
      </main>
    </>
  )
}

export default Home
