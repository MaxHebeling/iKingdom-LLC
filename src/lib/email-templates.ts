type Lang = "en" | "es";

type Template = {
  subject: string;
  html: string;
  text: string;
};

const STYLES = {
  bg: "#fbfbfa",
  bgCard: "#ffffff",
  fg: "#000000",
  fgMuted: "#1a1a1a",
  fgDim: "#5c5c5c",
  line: "#e8e8e7",
  accent: "#c9a96e",
};

function wrap(opts: { preheader: string; body: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>iKingdom</title>
</head>
<body style="margin:0;padding:0;background:${STYLES.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${STYLES.fg};">
<span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${opts.preheader}</span>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${STYLES.bg};">
  <tr>
    <td align="center" style="padding:48px 24px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px;background:${STYLES.bgCard};border:1px solid ${STYLES.line};">
        <tr>
          <td style="padding:40px 40px 0 40px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${STYLES.fgDim};">iKingdom</p>
            <div style="margin:14px 0 0 0;height:1px;width:32px;background:${STYLES.accent};"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px 40px 40px;font-size:16px;line-height:1.7;color:${STYLES.fgMuted};">
            ${opts.body}
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px 40px;border-top:1px solid ${STYLES.line};">
            <p style="margin:24px 0 0 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${STYLES.fgDim};">San Diego, CA</p>
          </td>
        </tr>
      </table>
      <p style="margin:24px 0 0 0;font-size:11px;color:${STYLES.fgDim};">
        <a href="https://www.ikingdom.org" style="color:${STYLES.fgDim};text-decoration:none;">www.ikingdom.org</a>
      </p>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function prospectConfirmationEmail(opts: {
  name: string;
  lang: Lang;
}): Template {
  const firstName = opts.name.split(" ")[0] || opts.name;

  if (opts.lang === "es") {
    const subject = "Solicitud recibida — iKingdom";
    const preheader = "Un socio senior revisará personalmente tu solicitud en los próximos 5 días hábiles.";
    const body = `
<p style="margin:0 0 20px 0;">${firstName},</p>

<p style="margin:0 0 20px 0;">Tu solicitud ha sido recibida.</p>

<p style="margin:0 0 20px 0;">Un socio senior la revisará personalmente durante los próximos 5 días hábiles. La revisión cubre compatibilidad, alcance y capacidad de despliegue actual. Si tu solicitud avanza, tu siguiente contacto será una llamada de descubrimiento.</p>

<p style="margin:0 0 20px 0;">No aceptamos muchos compromisos cada trimestre, y no nos movemos rápido en el frente por diseño. La calidad de con quién trabajamos es el sistema.</p>

<p style="margin:0 0 28px 0;">Si algo cambia en tu lado antes de que te contactemos, responde a este correo — llega directamente a executive@ikingdom.org.</p>

<p style="margin:0;font-style:italic;color:${STYLES.fg};">— iKingdom</p>
`;
    const text = `${firstName},

Tu solicitud ha sido recibida.

Un socio senior la revisará personalmente durante los próximos 5 días hábiles. La revisión cubre compatibilidad, alcance y capacidad de despliegue actual. Si tu solicitud avanza, tu siguiente contacto será una llamada de descubrimiento.

No aceptamos muchos compromisos cada trimestre, y no nos movemos rápido en el frente por diseño. La calidad de con quién trabajamos es el sistema.

Si algo cambia en tu lado antes de que te contactemos, responde a este correo — llega directamente a executive@ikingdom.org.

— iKingdom
San Diego, CA
www.ikingdom.org`;

    return { subject, html: wrap({ preheader, body }), text };
  }

  const subject = "Application received — iKingdom";
  const preheader = "A senior partner will personally review your application within 5 business days.";
  const body = `
<p style="margin:0 0 20px 0;">${firstName},</p>

<p style="margin:0 0 20px 0;">Your application has been received.</p>

<p style="margin:0 0 20px 0;">A senior partner will personally review it over the next 5 business days. The review covers fit, scope, and current deployment capacity. If your application is moved forward, your next contact will be a discovery call.</p>

<p style="margin:0 0 20px 0;">We don't onboard many engagements each quarter, and we don't move fast on the front end on purpose. The quality of who we work with is the system.</p>

<p style="margin:0 0 28px 0;">If anything changes on your end before we reach out, reply to this email — it goes directly to executive@ikingdom.org.</p>

<p style="margin:0;font-style:italic;color:${STYLES.fg};">— iKingdom</p>
`;
  const text = `${firstName},

Your application has been received.

A senior partner will personally review it over the next 5 business days. The review covers fit, scope, and current deployment capacity. If your application is moved forward, your next contact will be a discovery call.

We don't onboard many engagements each quarter, and we don't move fast on the front end on purpose. The quality of who we work with is the system.

If anything changes on your end before we reach out, reply to this email — it goes directly to executive@ikingdom.org.

— iKingdom
San Diego, CA
www.ikingdom.org`;

  return { subject, html: wrap({ preheader, body }), text };
}
