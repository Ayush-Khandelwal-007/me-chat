import Head from 'next/head'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Me-Chat </title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Sidebar/>
    </div>
  )
} 