import nodemailer from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

// Lee la plantilla del archivo
const templateConfirmAccount = fs.readFileSync(
  'templates/templateConfirmAccount.hbs',
  'utf8'
)
const templateResetPassword = fs.readFileSync(
  'templates/templateResetPassword.hbs',
  'utf8'
)

// Compila la plantilla
const templateConfirm = handlebars.compile(templateConfirmAccount)
const templateReset = handlebars.compile(templateResetPassword)

export const emailRegistroGmail = async (datos) => {
  const { email, nombre, token } = datos

  const data = {
    nombre,
    url: process.env.FRONTEND_URL + '/auth/confirmar/' + token,
  }

  // Crea el HTML del correo electrónico utilizando la plantilla y los datos
  const html = templateConfirm(data)

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Información del email

  await transport.sendMail({
    from: '"LG Social - Administrador de Proyectos" <cuentas@LGSocial.com>',
    to: email,
    subject: 'LG Social - Comprueba tu cuenta',
    text: 'Comprueba tu cuenta LG Social',
    html,
  })
}

export const emailOlvidePasswordGmail = async (datos) => {
  const { email, nombre, token } = datos

  const data = {
    nombre,
    url: process.env.FRONTEND_URL + '/auth/olvide-password/' + token,
  }
  // Crea el HTML del correo electrónico utilizando la plantilla y los datos
  const html = templateReset(data)

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Información del email

  await transport.sendMail({
    from: '"LG Social - Administrador de Proyectos" <cuentas@LGSocial.com>',
    to: email,
    subject: 'LG Social - Comprueba tu cuenta',
    text: 'Reestablece tu Contraseña',
    html,
  })
}
