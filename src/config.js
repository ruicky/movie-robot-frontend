export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const auth0Config = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const cognitoConfig = {
  userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
};

export const ptSiteData = [{"name": "mteam", "domain": "kp.m-team.cc"}, {
  "name": "hdsky",
  "domain": "hdsky.me"
}, {"name": "tjupt", "domain": "tjupt.org"}, {"name": "hdchina", "domain": "hdchina.org"}, {
  "name": "ssd",
  "domain": "springsunday.net"
}, {"name": "chdbits", "domain": "chdbits.co"}, {"name": "keepfrds", "domain": "pt.keepfrds.com"}, {
  "name": "btschool",
  "domain": "pt.btschool.club"
}, {"name": "putao", "domain": "pt.sjtu.edu.cn"}, {"name": "pterclub", "domain": "pterclub.com"}, {
  "name": "pttime",
  "domain": "www.pttime.org"
}, {"name": "ourbits", "domain": "ourbits.club"}, {"name": "lemonhd", "domain": "lemonhd.org"}, {
  "name": "pthome",
  "domain": "pthome.net"
}]