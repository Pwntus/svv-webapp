import AWS from 'aws-sdk'
import { Cognito } from '@/lib/Cognito'

class MICClass {

  invoke (name, payload) {
    return new Promise((resolve, reject) => {
      let params = {
        FunctionName: Cognito.manifest[name],
        Payload: JSON.stringify(payload)
      }
      let lambda = new AWS.Lambda()
      lambda.invoke(params, (err, data) => {
        if (err)
          reject(err)
        resolve(JSON.parse(data.Payload))
      })
    })
  }
}

export let MIC = new MICClass
