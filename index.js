const staticUrl = 'https://static-links-page.signalnerve.workers.dev'
const avatarUrl =
  'https://media-exp1.licdn.com/dms/image/C5603AQHuRdi4MMKx1w/profile-displayphoto-shrink_400_400/0?e=1609372800&v=beta&t=55oEc036kx0xkebQ0SmthbSfiEFjVDRciyDqUfDwHKw'
const bgUrl =
  'https://lh3.googleusercontent.com/1xmKDtAXS1nz1fmWDMFWCXNxxZX2cYwskIxZ70a5a17gIO3h3PqM9P7JEhlvpX5xp2ZVm0DsxAeUOGQNM5N_D-psvfA4ROep_Lgun5mffq4FJg75yTMFPWxxMCz9BjvbU7eWeDLKBp6RTlCD-QmLtStVbiXXV4rcqX42gZ04h4LfZtPuLy4cB_nu8qNdJ-QivgMgSckStfu0XTeCYyyu32ijOcRfuzIW4ERRYrUhTsRAGwVPlRr8O3mbYxtcZPyl7FMOj6J6kpgqa7E3-pQtlnbHZMy_BjLuQ-V5aimDdduuoGbfz2hYAfT-0Cg2yCv_2F5ABsazVDgMNxVDZiPpSJJhjhZRBDgDHJwOVFgXQXeKeK1f8XaJCF4Qujh2RqaRHlh_dkXytuL3Vv3q0ny6IrPDRHd5BavQ-QHGJO7u-EwB7vGpjsaZRqk6-zf_oqlrxfVzgnYtsXPsOO3mc7MkdXgMCUtscXU478L2agco3AU0kJYtPpe9_uKbJZfpSRg7itsl7hUip8OJTx_ElS8O0IwjyDjeD6MynK5KiLT8DhDZ9oToQVtkTm03lYxnmrOxhsxmDfTpsPVGzjfEco5hP4zqCVOviqSG_iY58zi3956aMTDS4NNeGSwMaeQ4kJCkXH6upf7vaTQJkmaytRV1QnkINBw1y9gLZLX8KcNjZP8iTVNo2eA8c4rmlJ87wRs=w1896-h1422-no?authuser=0'
const links = [
  {
    name: 'Portfolio',
    url: 'https://stephmeyering.com',
  },
  {
    name: 'Stereo',
    url: 'https://stereocloud.herokuapp.com/#/',
  },
  {
    name: 'Fractals',
    url: 'https://steph-meyering.github.io/fractals/',
  },
  {
    name: 'Co-Habit',
    url: 'https://cohabit.herokuapp.com/',
  },
]

const socials = [
  {
    url: 'https://www.linkedin.com/in/steph-meyering/',
    icon: 'https://simpleicons.org/icons/linkedin.svg',
  },
  {
    url: 'https://github.com/steph-meyering/',
    icon: 'https://simpleicons.org/icons/github.svg',
  },
  {
    url: 'https://angel.co/u/steph-meyering',
    icon: 'https://simpleicons.org/icons/angellist.svg',
  },
]

const initJSON = {
  headers: { 'content-type': 'application/json;charset=UTF-8' },
}

const initHTML = {
  headers: { 'content-type': 'text/html;charset=UTF-8' },
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
  let url = new URL(request.url)
  if (url.pathname === '/links') {
    const json = JSON.stringify(links, null, 2)
    return new Response(json, initJSON)
  } else {
    let res = await fetch(staticUrl, initHTML)
    const rewriter = new HTMLRewriter()
      .on('#links', new LinksTransformer(links))
      .on('#profile', new ProfileTransformer())
      .on('#avatar', new AvatarTransformer())
      .on('#name', new NameTransformer())
      .on('#social', new SocialTransformer(socials))
      .on('title', new TitleTransformer())
      .on('body', new BackgroundTransformer())
    return rewriter.transform(res)
  }
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(el) {
    for (let link of this.links) {
      let child = `
        <a href="${link.url}" target="_blank" rel="noopener noreferer">
          ${link.name}
        </a>`
      el.append(child, { html: true })
    }
  }
}

class ProfileTransformer {
  async element(el) {
    el.removeAttribute('style')
  }
}

class AvatarTransformer {
  async element(el) {
    el.setAttribute('src', avatarUrl)
  }
}

class NameTransformer {
  async element(el) {
    el.setInnerContent('Stéphane Meyering')
  }
}

class SocialTransformer {
  constructor(socials) {
    this.socials = socials
  }

  async element(el) {
    el.removeAttribute('style')
    for (let social of this.socials) {
      let child = `
        <a href="${social.url}" target="_blank" rel="noopener noreferer">
          <img style="filter: invert(1)" src="${social.icon}"></img>
        </a>
        `
      el.append(child, { html: true })
    }
  }
}

class TitleTransformer {
  async element(el) {
    el.setInnerContent('Stéphane Meyering')
  }
}

class BackgroundTransformer {
  async element(el) {
    el.setAttribute(
      'style',
      `background: url(${bgUrl}) center; background-size: cover;`,
    )
  }
}
