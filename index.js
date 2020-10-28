const staticUrl = 'https://static-links-page.signalnerve.workers.dev'
const avatarUrl = 'https://media-exp1.licdn.com/dms/image/C5603AQHuRdi4MMKx1w/profile-displayphoto-shrink_400_400/0?e=1609372800&v=beta&t=55oEc036kx0xkebQ0SmthbSfiEFjVDRciyDqUfDwHKw'
const bgUrl = 'https://raw.githubusercontent.com/steph-meyering/portfolio/master/images/altbg.jpg'

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

// Headers

const initJSON = {
  headers: { 'content-type': 'application/json;charset=UTF-8' },
}

const initHTML = {
  headers: { 'content-type': 'text/html;charset=UTF-8' },
}

// Fetch Listener

/**
 * Fetch and log a given request object
 * @param {Request} request
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
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


// Element Handlers

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
