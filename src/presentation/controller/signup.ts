import { MissingParamError } from '../errors/missing-param-errors'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-errors '

export class SignUpController implements Controller {
  constructor (private readonly _emailValidator: EmailValidator) {

  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValidEmail = this._emailValidator.isValid(httpRequest.body.email)

    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'))
    }
    return {
      statusCode: 200,
      body: 'Success'
    }
  }
}
