export const passwordRegex = /^[A-Za-z0-9_#$%.-=+;:]{8,30}$/
export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]+\.[A-Za-z]{2,}$/
export const loginRegex = /^[A-Za-z0-9_]{3,30}$/

export const projectValidation = {
    nameRegex: /^[\p{L}0-9_\- ]{5,100}$/u,
    descriptionRegex: /^.{0,1000}$/
}

Object.freeze(projectValidation);