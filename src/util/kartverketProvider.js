import { Provider } from 'leaflet-geosearch'
import { xml2js } from 'xml-js'

export default class KarverketProvider extends Provider {
  endpoint({ query } = {}) {
    const { params } = this.options;

    const paramString = this.getParamString({
      ...params,
      navn: query + '*',
      eksakteForst: false,
      epsgKode: 4326,
    });
    return `https://ws.geonorge.no/SKWS3Index/ssr/sok?${paramString}`;
  }

  parse(xml) {
    const data = xml2js(xml, {compact: true});
    
    return data.sokRes.stedsnavn.filter(s => s.navnetype._text === 'By').map(s => ({
      x: parseFloat(s.aust._text),
      y: parseFloat(s.nord._text),
      label: s.stedsnavn._text,
    }));
  }

  async search({ query }) {
    const url = this.endpoint({ query });

    const request = await fetch(url);
    const xml = await request.text();
    return this.parse(xml)
  }
}