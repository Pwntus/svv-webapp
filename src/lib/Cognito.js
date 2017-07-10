import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails
} from 'amazon-cognito-identity-js/dist/amazon-cognito-identity.min'
import AWS from 'aws-sdk'

class CognitoClass {

  constructor () {
    this.manifest = null
  }

  init (manifest) {
    if (this.manifest !== null)
      return

    this.manifest = manifest

    AWS.config.update({
      region: this.manifest.Region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.manifest.IdentityPool
      })
    })

    this.userPool = new CognitoUserPool({
      UserPoolId: this.manifest.UserPool,
      ClientId: this.manifest.UserPoolClient
    })
  }

  get currentUser () {
    return this.userPool.getCurrentUser()
  }

  cognitoUser (username) {
    return new CognitoUser({
      Username: username,
      Pool: this.userPool
    })
  }

  /**************************************************
   * Login Service
   */
  authenticate (username, password) {

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    })

    return new Promise((resolve, reject) => {
      this.cognitoUser(username).authenticateUser(authenticationDetails, {
        onFailure: (err) => {
          reject(err)
        },
        onSuccess: (result) => {

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.manifest.IdentityPool,
            Logins: {
              [`cognito-idp.${this.manifest.Region}.amazonaws.com/${this.manifest.UserPool}`]: result.getIdToken().getJwtToken()
            }
          })

          resolve(result)
        }
      })
    })
  }

  isAuthenticated () {
    let currentUser = this.currentUser

    return new Promise((resolve, reject) => {
      if (currentUser !== null) {
        currentUser.getSession((err, session) => {
          if (err) reject(err)
          if (!session.isValid()) reject()

          const userToken = session.getIdToken().getJwtToken()

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.manifest.IdentityPool,
            Logins: {
              [`cognito-idp.${this.manifest.Region}.amazonaws.com/${this.manifest.UserPool}`]: userToken
            }
          })

          resolve(userToken)
        })
      } else {
        reject(null)
      }
    })
  }

  logout () {
    this.currentUser.signOut()
  }

  getCredentials () {
    return this.isAuthenticated()
    .then(userToken => {
      const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials
      if (accessKeyId !== undefined && secretAccessKey !== undefined && sessionToken !== undefined)
        return Promise.resolve({ accessKeyId, secretAccessKey, sessionToken })

      return new Promise((resolve, reject) => {
        AWS.config.credentials.refresh((error) => {
          error ? reject(error) : resolve(AWS.config.credentials)
        })
      })
    })
    .catch(() => { return Promise.reject() })
  }

  /**************************************************
   * User Service
   */
  getParameters () {
    let currentUser = this.currentUser

    return new Promise((resolve, reject) => {
      if (currentUser !== null) {
        currentUser.getSession((err, session) => {
          if (err) reject(err)
          currentUser.getUserAttributes((err, result) => {
            err ? reject(err) : resolve(result)
          })
        })
      } else {
        reject(null)
      }
    })
  }
}

export let Cognito = new CognitoClass
