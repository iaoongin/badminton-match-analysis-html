import './utils/request.js'
import { IndexPage } from './page/index/index.js'
import { MatchPage } from './page/match/index.js'
import { VisualizationPage } from './page/visualization/index.js'

const NotFound = {template: '<p>Page not found</p>'}
const About = {template: '<p>about page</p>'}

const routes = {
    '/': IndexPage,
    '/about': About,
    '/match': MatchPage,
    '/visualization': VisualizationPage,
}



const app = new Vue({
    el: "#app",
    data: {
        currentRoute: window.location.hash.split("#")[1] || '/',
        content: "",
        loading: false
    },
    computed: {
        ViewComponent() {
            console.log(this.currentRoute)
            return routes[this.currentRoute] || NotFound
        }
    },
    render(h) {
        return h(this.ViewComponent)
    },
})

window.app = app