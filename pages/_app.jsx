import '../styles/Global.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading'
import { TrendingUpTwoTone } from '@material-ui/icons';
import { useEffect } from 'react';
import firebase from 'firebase'

export default function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
        {
          merge: true
        }
      )
    }
  }, [user])

  if (loading) return <Loading />


  if (!user) {
    return <Login />
  }

  return <Component {...pageProps} />
}