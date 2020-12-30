---

publishedAt: sep 01, 2020
date: "2020-09-01"
slug: making-a-jamstack-blog-with-gridsome
title: Making a JAMstack blog with Gridsome

---


# Making a JAMstack blog with Gridsome

I have been eager to try a JAMstack blog since the first time I heard of it. The idea of a fast reliable static website generated from modern technologies sounded wonderful.

Mainly because [I already had a blog](https://github.com/kgjoner/ficcionados), and I have suffered to make a SPA beat SEO. The prerender plugin I used did not work 100%, and it was there only to deal with bots, while users kept receiving a fresh content via AJAX. Back then, I thought it was the best solution to deal with dynamic content without going for server side rendering — which would lead to more complexity and more costs.

Yet the blog was running and working, so I postponed migrating it to JAMstack for a while. The things changed when I got to know the JAMstack conference of this year would happen online, and I took my seat. No regrets. I felt it was time to finally face it.

So yeah, today that blog is static and I have no more concerns about SEO. Actually, when I decided to start this blog, I was so satisfied I had no doubt I would also do it with JAMstack.


## But what is JAMstack?

JAMstack stands for Javascript, API and Markup. It is not a specific technology but a way to build and deliver websites. The idea is serving only static assets as pure Javascript, HTML and CSS codes.

But unlikely early FTP times, there is no need to deal with web servers. The website is directly pushed to CDN, making it faster and more secure. And as soons as a new version of it is uploaded, the CDN invalidates the cache, so no worries about old content being delivered.

You then may use third party APIs to handle [user generated content](#dealing-with-generated-content), like forms or comments, and be free from a backend.

_Nice, but what about my own generated data, like blog posts?_ 

Well, if you prefer keeping them in an external database, they should be gotten during website building in order to prerender all the pages. And that can be achieved thanks to static site generators, like Gridsome.


## About Gridsome Choice

A static site generator (SSG) gets data, interpret it when needed — like for markdown files —, and apply it to templates for generating all the pages. 

SSGs are made for different languages, libraries and frameworks; there are a bunch of them. But as the blog I had was already using Vue, I ended up deciding between only a few: Nuxt, VuePress and Gridsome.

[Nuxt](https://nuxtjs.org/) was primary designed for server side rendering rather than generating static pages. So despite being possible to work with markdown or headless CMS, it is more complicated than the other alternatives.

[VuePress](https://vuepress.vuejs.org/) has natural support for markdown files, but its scope is pretty limited. In general, it is optmized for creating documentation websites. It also has fewer plugins than Gridsome.

At last, [Gridsome](https://gridsome.org/) was strongly inspired by Gatsby, which is a great SSG for React apps. Even though, it has the smallest community of the three, its documentation is not so clear in some points, and didn't get its 1.0 version yet.

But I still think it has the greatest potentional of all of them when building a simple blog.


## What are we gonna do?

Let's use as example a blog with a home, an about and a contact page. Besides, of course, one page per post, and one page per post category. It would also be nice if the visitors could let some comments, wouldn't it? And we are gonna do all of that using Gridsome to generate static pages.

It is actually pretty similar to the blog you are visiting right now. 

However, there are some variants you need to think about. The content here is written in markdown files uploaded directly in my git repository, so everytime I push a new post, the website is updated. There is no backend at all.

But perhaps you need to use a third party CMS or even build your own backend. No problem with it, but we are starting from the point where you already know how to manage your content and where to store it. So I will just cover how to retrieve the data from there.

If you don't know it yet, but every blog writer of yours knows how to use git, I suggest you try the markdown files approach with no backend. You just need to create a folder like `src/data` and keep all the posts there.


## So let's do it!

First, add Gridsome to your project:

```shell
npm install gridsome
```

Or you can install the Gridsome CLI and create a project using it:

```shell
npm install --global @gridsome/cli
```

```shell
gridsome create my-blog
 cd my-blog
```

> I'm assuming you already know Vue. So this guide will focus on Gridsome implementations only, not in how to code the components.


### Settings

#### Gridsome Files 

Alright, so you may have noticed two new Gridsome files in your root folder.

In `gridsome.config.js` lies the basic website configurations and the plugins options.

```javascript
  // gridsome.config.js
  module.exports = {
    siteName: 'My Blog',
    templates: {},
    plugins: [],
  }
```

  The `siteName` will be appended to the title of your pages by default, separated from the page title by a hyphen. In the about page, for example, the title would be: _About - My Blog_.

  This pattern is controlled by other property, `titleTemplate`. Its default value is written as `%s - <siteName>`, where `%s` is the specific page title. But you can overwrite it as you wish:
  
```javascript
  // gridsome.config.js
  module.exports = {
    siteName: 'My Blog',
    titleTemplate: '%s >> Blog of Mine',
    // ...
  }
```

  You may also declare properties like `siteUrl`, `siteDescription` or `pathPrefix`. For the complete list, check the [official documentation](https://gridsome.org/docs/config/).

  Templates and plugins will be discussed in the upcoming sections.

  On the other hand, `gridsome.server.js` is the place to build the data layer and to create pages. But as there are other ways to do both things, this file is optional. More about it later.

```javascript
  // gridsome.server.js
  module.exports = function (api) {
    api.loadSource(({ addCollection }) => {
      // check the Data Store API section
    })

    api.createPages(({ createPage }) => {
      // check the Page API section
    })
  }
```

#### Main.js

The `main.js` file in the `/src` folder is where you may:
* Set a default layout; 
* Declare Vue plugins like Vuex or Bootstrap Vue;
* Declare your Vue directives; 
* Specify some global meta tags;
* Define some [routing rules](#redirects).

```javascript
  // src/main.js
  import Vuex from 'vuex'
  import store from './store'
  import MyDirective from '@/directives/MyDirective'
  import DefaultLayout from '@/layouts/Default.vue'

  export default function (Vue, { appOptions, router, head }) {
    Vue.component('Layout', DefaultLayout)

    Vue.use(Vuex)
    appOptions.store = new Vuex.Store(store)

    Vue.directive('my-directive', MyDirective)

    head.link.push({
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Family+Name&display=swap'
    })
    // ...
  }
```

#### The Optional App.vue

Instead of specifying a default layout as it was mentioned above, you may just create a `App.vue` file in the `/src` folder. Just do not forget adding a `<router-view>` tag.

``` javascript
  // src/App.vue
  <template>
    <div id="app">
      <Header />
      <router-view />
      <Footer />
    </div>
  </template>

  <script>
  import Header from '@/components/Header' 
  import Footer from '@/components/Footer' 

  export default {
    name: 'App',
    components: { Header, Footer }
  }
  </script>
```

#### Overriding index.html

The `index.html` is generated automatically, but you may override it creating one in the `/src` folder. Before doing it, just remember global metatags can be managed in `main.js`.

Also, you can [check for possible plugins](https://gridsome.org/plugins/) to do whatever you could do in index.html; for example, there is a [plugin to set the google analitycs bot](https://gridsome.org/plugins/@gridsome/plugin-google-analytics).


#### The 404 Page

Gridsome comes with a pretty basic page to show a not found error, but you can override it too. You just need to create a component inside `src/pages` called `404.vue`.


### Data Layer

During development and build, Gridsome gathers all required data into a local in-memory layer, which can be queried via GraphQL by any component — if you are not familiar with it, don't worry, I will cover the basics to query soon.

The data is organized in __collections__, like tables in a tabular structure, and each one may have several __nodes__, like rows in a table.

The way for creating collections and nodes depends, of course, on where your data is stored. They might be in json or markdown files (like these words you are reading), in a CMS, or even be in your own custom backend (like my other blog).


#### By Plugins

There are several plugins you may use to retrieve your data; they will handle source files or CMS cases. Here I will focus on the traditional case of markdown files, but feel free to [search a custom plugin](https://gridsome.org/plugins/) that best fits your needs.

```shell
npm install @gridsome/source-filesystem
```

The above plugin actually serves for any file extension, not only markdown. To use it, we need to declare it in `gridsome.config.js`:

```javascript
  // gridsome.config.js
  module.exports = {
    plugins: [
      {
        use: '@gridsome/source-filesystem',
        options: {
          typeName: 'Post',
          path: './src/data/posts/*.md',
        }
      }
    ]
  }
```

The `typename` will be the collection's name, and each markdown file inside `src/data/posts` will be a node.

We still need to install a markdown interpreter, which will transform our file into an object.

```shell
npm install @gridsome/transformer-remark
```

Although no extra configuration being required after installing it, you may [configure some options](https://gridsome.org/plugins/@gridsome/transformer-remark). The standard ones already populate the nodes with the following properties:

```javascript
{
  id: '17dc019214710ae09', //auto generated hexcode
  title: 'My Great Post', //the title is gotten from your h1 tag not the file name
  excerpt: 'The first sentences of your post',
  path: '/blog/my-great-post', 
  content: 
    '<h1 id="my-great-post">My Great Post<h1><p>All the post content in HTML format</p>'
  headings: [
    { 
      depth: 1,
      value: 'My Great Post',
      anchor: '#my-great-post',
    }, 
    // ...
  ],
  timeToRead: 12, //min
  fileInfo: {
    extension: 'md',
    directory: './src/data/posts',
    path: null,
    name: 'myGreatPost'
  }
}
```

To define custom properties like a _category_, a _description_, or even a _publishing date_, you can declare them at the top of your markdown file between `---`:

```shell
  // src/data/posts/myGreatPost.md
  ---
  category: my category
  description: a nice description about this content
  publishedAt: sep 01, 2020
  ---

  # My Great Post

  All the post content...
```

So the nodes on Post collection will have custom properties plus the ones gotten by the transformer plugin. But instead of letting our categories being just a property, it would be better give them their own collection. That way, they could be queried apart the posts, and it will be easier to make their own pages.

That is possible just filling an option in `@gridsome/source-filesystem` configuration:

```javascript
  // gridsome.config.js
  module.exports = {
    plugins: [
      {
        use: '@gridsome/source-filesystem',
        options: {
          typeName: 'Post',
          path: './src/data/posts/*.md',
          refs: {
            category: {
              typeName: 'Category',
              create: true
            }
          }
        }
      }
    ]
  }
```

We are creating a new collection called Category and populating it with each different _category_ found in post properties. Not only that, but also creating a reference between post nodes and category nodes. 

After doing it, the _category_ inside post will no longer be a string but an object with two properties: _id_ and _title_ (its original value).

Don't worry if the intent of this is not clear yet; it will become it when we talk about [templates](#templates) and [taxonomy](#taxonomy).


#### By The Data Store API

It is useful when you are using an external data source, like when your blog consumes a backend api. That is exactly the case of the blog I said I have recently transformed into JAMstack.

The Data Store Api is managed by the `loadSource` hook in `gridsome.server.js`:

``` javascript
  // gridsome.server.js
  const axios = require('axios')
  const baseApiUrl = 'https://myblogbackend.com'

  module.exports = function (api) {
    api.loadSource(async actions => {
      const categoryCollection = actions.addCollection('Category')
      const postCollection = actions.addCollection('Post')

      const { data: categories } = await axios.get(`${baseApiUrl}/categories`)
      const { data: posts } = await axios.get(`${baseApiUrl}/posts`)


      for(const category of categories) {
        categoryCollection.addNode(category)
      }

      for (const post of posts) {
        postCollection.addNode({
          ...post,
          category: actions.store.createReference('Category', post.categoryId),
        })
      }

    })
  }
```

First, you create the desired collections with the action `addCollection`. It returns a reference to the collection just created, which has the `addNode` method.

Before using it though, you need to call your external api and retrieve the data.

In this example, each category and post are objects with an _id_ property already gotten from the backend. If the node object does not have an _id_, Gridsome will create one. 

When adding a node, you can make a reference to another node with the action `createReference`. It receives as first parameter the name of the collection you wish to reference to, and then the node _id_ from that colection.

So each post node will have a property _category_ nesting all the properties found in the Category collection. That makes the [queries](#queries) pretty easy to write!

That's also how we can work with [taxonomy](#taxonomy).


### Pages

#### The File System

All the files inside `/src/pages` folder will be used to generate routes. Gridsome uses vue-router behind the scenes, so that happens automatically. You just need to name the file according to the route you wish:
  
  * `Index.vue` generates the homepage `/`
  * `About.vue` generates the route `/about` 
  * `SomeSpecialRoute.vue` generates `/some-special-route`

Further, nested files will generate routes according to their entire path:

  * `CategoryFolder/CategoryOne.vue` generates the route `/category-folder/category-one`

You can also use the File System to generate dynamic routes:

  * `Category/[id].vue` generates the route `/category/:id`

The _id_ will appear in `$route.params` as in a common vue-router use. So, yeah, you could use it to make an AJAX call and fill the page with an external content.

Nonetheless, keep in mind that using dynamic routing do not let Gridsome aware of all the routes you wish to generate, which means it will not serve those pages as static assets, and it will probably lead to the 404 page. You may workaround it with some [rewrite rules](https://gridsome.org/docs/dynamic-routing/#generating-rewrite-rules).

Even though, when thinking in a way to deal with the posts or the categories of our blog, this is not the best alternative. It would be pushing us off from the JAMstack approach, neglecting the data layer and wasting great tools that Gridsome offers. That's why the dynamic routing by the File System should be seen as situational rather than a standard approach.

> If you make an api call it is important to make it in the `mounted` hook, not in the `created` one.


#### The Pages API

If you wish more control over your pages you can create them with the `createPages` hook in `gridsome.server.js`. You can use it to make a route with any name pointing to any component in your directory:

```javascript
  // gridsome.server.js
  module.exports = function (api) {
    api.createPages(({ createPage }) => {
      createPage({
        path: '/contact',
        component: './src/myOthePagesFolder/FormForContact.vue'
      })
    })
  }
```

But it may seem overcomplicating stuff. I mean, why would you put a page component in other folder? The File System is simpler and more elegant, right?

Well, for the most scenarios it really is. For a simple blog you may just stick to the File System and the Templates (as I will cover soon). 

However, there are two great features in the Pages API to be explored:

* Provide a __context__ to a page, meaning a variable accessible in its queries.
* Retrieve values from the __data layer__ and create a page based on them.

With those we could, for example, narrow what otherwise would be a dynamic route:

```javascript
  // gridsome.server.js
  module.exports = function (api) {
    api.createPages(({ graphql, createPage }) => {
      const { data } = await graphql(`{
        allPost {
          edges {
            node {
              id
              slug
            }
          }
        }
      }`)

      data.allProduct.edges.forEach(({ node }) => {
        createPage({
          path: `/posts/${node.slug}`,
          component: './src/templates/Post.vue',
          context: {
            id: node.id
          }
        })
      })
    })
  }
```

This way we are telling Gridsome all the pages we want to generate, so there is no worry about one of them leading to the 404 page. Beside that, the _id_ will be available in the `Post.vue` [queries](#queries) allowing you to get the correct node for each route.

Fortunately, for cases just like the one above Gridsome offers a simpler way to do it. That's what Templates are all about.


### Templates

A Template is a page model that will be replicated for each node in a collection. It is the ideal solution for posts and categories. 

To tell Gridsome we are going to use ones, we declare them in `gridsome.config.js`:

```javascript
  // gridsome.config.js
  module.exports = {
    templates: {
      Post: [{
        path: node => `/posts/${node.slug}`
      }],
      Category: [{
        path: node => `/categories/${node.id}`
      }],
    },
    ...
  }
```
The declaration must be made with the name of an existent collection, which give us access to the variables in it, as the _slug_ and the _id_. 

The trick here is that Gridsome will automatically look inside the `src/templates` folder for a component named exactly like the collection. If for any reason you would like to point to another component, you can do it like:

```javascript
  // gridsome.config.js
  module.exports = {
    templates: {
      Post: [{
        path: node => `/posts/${node.slug}`,
        component: './src/views/RealPostPage.vue'
      }],
      ...
    },
    ...
  }
```

As I said, the Templates use is just a syntatic sugar for the last case shown in the Pages API section. So as you may expected, the _id_ is passed as context to the template component, allowing it to make the proper queries.


### Queries

All the queries are made using GraphQL. They are written inside a special tag, outside the three regular ones (template, script and style).

In Pages and Templates you use `<page-query>`, and in all other components you use `<static-query>`. The difference is that you can only use variables in the page-query tag; regular components do not have a context after all.

```javascript
  // src/pages/Index.vue
  <template>
    <!-- ... -->
    <ul class="list-of-posts">
      <li v-for="post in posts" 
        :key="post.id">
        <h2>{{ post.title }}<h2>
        <p>{{ post.description }}</p>
      </li>
    </ul>
    <!-- ... -->
  </template>

  <page-query>
    query {
      posts: allPost(sortBy: "publishedAt", order: DESC) {
        edges {
          node {
            id
            title
            description
          }
        }
      }
    }
  </page-query>

  <script>
    export default {
      name: "Home",
      computed: {
        posts() {
          return this.$page.posts.edges.map(p => p.node)
        }
      }
    }
  </script>
```

Remember that in Pages with a given context and Templates you can query with variables. Thus, our post component could be something like:

```javascript
  // src/templates/Post.vue
  <template>
    <h1>{{ $page.post.title }}<h1>
    <p>{{ $page.post.category.name }}</p>
    <p>{{ $page.post.publishedAt }}</p>
    <div v-html="$page.post.content"></div>
  </template>

  <page-query>
    query ($id: ID!) {
      post(id: $id) {
        title
        content
        publishedAt
        category {
          name
        }
      }
    }
  </page-query>
```

To get familiar with the data layer and try making some queries you can use the explore mode:

```shell
npm run explore
```


### Taxonomy

When you think about a page for a given category of posts, you expect it actually lists those related posts, don't you?

If so, you may have seen a problem with our category template. Following the above examples, it would have access only to their own category properties. And what are they? Just an id and a name?

Well, not exactly. The reference we have built between post and category nodes serves both to posts get their category properties as well as to the category get to know all posts referencing it.

The trick is in the query:

```javascript
  // src/templates/Category.vue
  <template>
    <!-- ... -->
    <ul class="list-of-posts">
      <li v-for="post in posts"
        :key="post.id">
        <h2>{{ post.title }}<h2>
        <p>{{ post.description }}</p>
      </li>
    </ul>
    <!-- ... -->
  </template>

  <page-query>
    query($id: ID!) {
      category(id: $id) {
        id
        name
        belongsTo(sortBy: "publishedAt", order: DESC)  {
          edges {
            node {
              ... on Post {
                id
                title
                description
              }
            }
          }
        }
      }
    }
  </page-query>

  <script>
    export default {
      name: "Category",
      computed: {
        posts() {
          return this.$page.category.belongsTo.edges.map(a => a.node)
        }
      }
    }
  </script>
```

As you can imagine, `belongsTo` lists all nodes on Post collection that have a reference to the given category. And that's all we need. 


### Layouts

Despite `src/layouts` being a standard folder, the content here is not interpreted in a special way. 

You are still gonna need importing the desired layout in your pages and declare it as any other component; using it, of course, wrapping all the other tags.

```javascript
  // src/pages/About.vue
  <template>
    <MySpecialLayout>
      <div class="about">
        <!-- ... -->
      </div>
    <MySpecialLayout>
  </template>

  <script>
    import MySpecialLayout from "@/layouts/MySpecialLayout"

    export default {
      name: "About",
      components: { MySpecialLayout }
    }
  </script>
```

If you have declared a default layout in `src/main.js`, it will be automatically available in all your pages with the name you have given. 


```javascript
  // src/main.js
  import DefaultLayout from '@/layouts/Default.vue'

  export default function (Vue, { appOptions, router, head, isClient }) {
    Vue.component('Layout', DefaultLayout)
    // ...
  }
```

```javascript
  // src/pages/Index.vue
  <template>
    <Layout>
      <div class="home">
        <!-- ... -->
      </div>
    <Layout>
  </template>

  <script>
    export default {
      name: "Home",
      // ...
    }
  </script>
```

Otherwise, as already mentioned, you can use a `App.vue` component, which makes sure all your pages will have the same layout defined there, as a header and a footer, with no further "per page" actions.



### Meta tags

Gridsome incorporates `vue-meta`, and you can use it in your components like so: 

```javascript
  // src/pages/Index.vue
  <script>
    export default {
      name: 'Home',
      metaInfo: {
        titleTemplate: 'My Blog >> The Ultimate One',
        meta: [
          {
            name: 'description',
            content: 'A blog about nice things.',
          },
        ],
      }
    }
  </script>
```

In the post template, as we need the queried data to populate the head, we use metaInfo as a function, and then we have acces to `this`.

```javascript
  // src/templates/Post.vue
  <script>
    export default {
      name: 'Post',
      metaInfo() {
        return {
          title: this.$page.post.title,
          meta: [
            {
              name: 'description',
              content: this.$page.post.description,
            },
            {
              name: 'author',
              content: this.$page.post.author,
            },
          ],
        }
      }
    }
  </script>
```


### Redirects

I have faced some problems when dealing with Gridsome redirects. I will list here some alternatives I have tried, despite not all of them having worked as I wished.


#### Redirect on Server
You may write redirect rules in your server, outside the Gridsome scope. However, it seems that Gridsome uses client side routing, meaning that no new requests are sent to the server after the initial load.

I use Netlify and I have tried writing some rules in the_ _redirects_ file, just to find out they were being ignored. You can check the response of Dennis, from Netlify support team, about this issue: 

[Redirect rules for Gridsome site processed during build, but not redirecting](https://community.netlify.com/t/redirect-rules-for-gridsome-site-processed-during-build-but-not-redirecting/13839)


#### Navigation Guard in 404
While no redirect is set, the page you wish to redirect from will probably be leading to the 404 page. So you could use the `beforeRouteEnter` guard in your `404.vue` component.

```javascript
  // src/pages/404.vue
  <script>
    export default {
      name: '404',
      beforeRouteEnter(to, from, next) {
        if(!process.isClient) return

        if(to.fullPath === '/my-old-path') {
          next('/my-new-path')
        } else {
          next()
        }
      }
    }
  </script>
```

There is an extra care here with navigation guards because of the building process. But beside that, I couldn't make it work in production and I didn't quite get why.

I ended up not digging much into it because there are better solutions. Not only better, but more elegant as well.


#### Router in main.js
As I said earlier, you can manage routing in `main.js`. It looks like:

```javascript
  // src/main.js
  export default function (Vue, { router, isClient }) {

    router.beforeEach((to, from, next) => {
      if(to.fullPath === '/my-old-path') {
        next('/my-new-path')
      } else {
        next()
      }
    })

  }
```

For most redirects this may be the best alternative. But there is at least one specific case that can generate a debate.

At the beggining of my older blog there was no path like _/posts/:slug_ because the path to posts were directly their slugs. So what I needed was a redirect like the following:

```shell
/:slug to /posts/:slug
```

Well, if it were only a few posts, it wouldn't harm adding one by one just like showed above, you may think. But this is not a scalable solution.

Instead, we could intercept all the routes that would lead to the 404 page. We can do it knowing they are named as `*`:

```javascript
  // src/main.js
  export default function (Vue, { router, isClient }) {

    router.beforeEach((to, from, next) => {
      if(to.fullPath === '/my-old-path') {
        next('/my-new-path')
      } else if(to.name === '*' && !to.fullPath.includes('/blog/')) {
        next(`/blog${to.fullPath}`)
      } else {
        next()
      }
    })

  }
```

So we are avoiding the 404 page prepending a _/blog_ to the route. But if the original path were not a real slug, it would fall again to 404. That is why we need to make the redirect only when the path has no _/blog_ in it; otherwise, it would start an infinite redirect loop.

Alright, this approach does not seem so elegant, right? Instead of it, we could keep an array with all the post slugs and check it for a redirect:

```javascript
  // src/main.js
  const slugs = [
    '/my-first-post',
    '/the-great-second'
  ]

  export default function (Vue, { router }) {

    router.beforeEach((to, from, next) => {
      if(to.fullPath === '/my-old-path') {
        next('/my-new-path')
      } else if(slugs.includs(to.fullPath)) {
        next(`/blog${to.fullPath}`)
      } else {
        next()
      }
    })

  }
```

Even though, we don't have access to the data layer here, so we would have to do hard coding to fill the array.

For cases like this one, I actually think there is a better solution: the redirect template.


#### Redirect Template

The idea is creating a [template](#template) that will serve only to redirect to the real one. That is possible because we can declare more than one template for the same collection.

```javascript
  // gridsome.config.js
  module.exports = {
    templates: {
      Post: [{
        path: node => `/posts/${node.slug}`
      }, {
        name: 'redirects',
        path: node => `/${node.slug}`,
        component: './src/redirects/PostRedirect.vue'
      }]
    },
    ...
  }
```

This way we are only generating the paths for the real slugs, while all the others _/wrong-path_ will keep leading the 404 page without any interference.

So to actually do the redirect we can use the meta tag `http-equiv="refresh"`:

```javascript
  // src/redirects/PostRedirect
  <page-query>
    query Redirect ($id: ID!) {
      post (id: $id) {
        slug
      }
    }
  </page-query>

  <script>
    export default {
      metaInfo() {
        return {
          title: `Redirecting to /post/${this.$page.post.slug}`,
          meta: [
            {
              'http-equiv': 'refresh',
              content: `0; URL='/post/${this.$page.post.slug}'`,
            },
          ],
          link: () => [
            {
              rel: 'canonical',
              href: `https://www.my-blog.com/blog/${this.$page.article.slug}`,
              id: 'canonical',
            },
          ],
        }
      },
    }
  </script>
```


### Special Tags

#### Linking

The `<g-link>` tag follows the same logic as `<router-link>` from vue-router. The difference is that `<g-link>` will prefetch the linked page when it is in view, which made the website pretty fast on routing. Awesome, right?

```html
<g-link to="/other-path/">Go to other path</g-link>
```

Of coure, it only works to link internal pages. For the external ones you must use the anchor tag `<a>`.


#### Images

The `<g-image>` tag is used as a normal `<img>` tag. However it includes a lazy loading feature, i.e., the image will only load when it is in view, appearing a blurred image while not loaded.

Beside that, if image is hosted locally, Gridsome will compress it and resize it, providing the size that best fits the screen.

```html
<g-image src="~/assets/img/my-image.png">
```

There are also other custom options. You can check them in the [documentation](https://gridsome.org/docs/images/).


## Dealing with Generated Content

### Forms

You may use a third party api like [Formspree](https://formspree.io/). But if you host your website on [Netlify](https://www.netlify.com/), you can stick with their forms API, which supports up to 100 free submissions per month against 50 from Formspree.

Netlify automatically detects your forms during building, so there is no worry about integration. You just need to write your form with these extra info:

```html
  // src/components/ContactForm.vue
  <template>
    <form name="Contact" 
      @submit.prevent="handleSubmit" 
      method="post" 
      data-netlify="true" 
      data-netlify-honeypot="bot-field">

        <input type="hidden" 
          name="form-name" 
          value="Contact" />

        <!-- your inputs here -->

    </form>
  </template>
```

The `name` in the `form` tag is how the submissions will be identified in your Netlify panel. The hidden `input` helps Netlify detecting the form, so it is important to keep its `value` the same as the previous given `name`.

The `handleSubmit` function should encode the data and send it to your homepage:

```javascript
  // src/components/ContactForm.vue
  <script>
    import axios from 'axios'

    export default {
      name: 'ContactForm',
      data: function() {
        return {
          name: '',
          email: '',
          message: ''
        }
      },
      methods: {
        handleSubmit() {
          const axiosConfig = {
            header: { "Content-Type": "application/x-www-form-urlencoded" }
          };
          axios.post("/", this.encode({
            "form-name": "Contact",
            name,
            email,
            message
            }),
            axiosConfig
          )
          .then(() => this.form = {name: '', email: '', text: ''})
        },

        encode(data) {
          return Object.keys(data)
            .map(
              key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
            )
            .join("&");
        },
      }
    }
  </script>
```

At last, in your Netlify panel you can set for being notified by email each time a new submission is received.


### Comments

You may create an account on [Disqus](https://disqus.com/) and register your website. It is free!

Then install `vue-disqus` and set it in `main.js`:

```shell
npm install vue-disqus
```

```javascript
  // src/main.js
  import VueDisqus from 'vue-disqus'

  export default function (Vue) {
    Vue.use(VueDisqus, {
      shortname: 'your-website-shortname-from-disqus'
    })
  }
```

Now all your components have access to one called `Disqus`. It will load a comment section stored in your Disqus account based on the `identifier` and the `url` you pass to it (scroll down to the end of this page to see one of those live).

```html
  // src/templates/posts
  <template>
    <!-- ... -->
    <Disqus
     :identifier="$page.post.slug"
     :url="`https://www.myblog.com/blog/${$page.post.slug}`"
    ></Disqus>
  </template>
```


### Github Actions

For other situations you can use the Github Actions for creating a pull request when a new data appears or even schedule Netlify builds. 

But it has, of course, its limitations. The new data will take minutes to appear in a new refreshed version of the site, so it does not attend all cases.

Either way, this topic gives an entire new post, and I will do it soon.


### Other plugins

There is also a full list of [Gridsome plugins](https://gridsome.org/plugins/), and you should take a look into it. There may already be a good solution for some other generated content issue.


## From here and beyond

Now it is time to customize your components and make your blog appear like you wish.

Let's just summarize the main steps we have gone through:

* Get the data and create Post and Category collections either by a plugin or by the Data Store API;
* Define a default layout and add it in `src/main.js` or create a `src/App.vue` component;
* Create `Index.vue`, `About.vue` and `Contact.vue` inside `src/pages` folder;
* Configure a Template for posts and another for categories;
* Make the correct queries, using the _id_ variable in templates and `belongsTo` for getting all posts belonged to a given category;
* Choose a third party form API to manage your contact form;
* Add Disqus to your post pages to get a comment section.

And that is it! So when you build it, you will have all your pages generated as if they were static assets. Easy to deploy, easy to manage, scalable, secure, and SEO friendly. A JAMstack blog.