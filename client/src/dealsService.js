import axios from 'axios';

const url = 'http://localhost:5000/api/deals/';
//eslint-disable-next-line
const loginUrl = 'http://localhost:5000/api/deals/login/';

class DealsService {

//getDeals
    static getDeals() {
        //eslint-disable-next-line
        return new Promise(async (resolve, reject) => {
            try {
                //eslint-disable-next-line
                const res = await axios.get(url);
                const data = res.data;
                resolve(
                    data.map(deal => ({
                        ...deal,
                        createdAt : new Date(deal.createdAt)
                    }))
                );
            } catch (error) {
                reject(error);
            }
        });
    }

//login
//eslint-disable-next-line
    static loginCheck(email, pass) {
/*         return axios.post(`$(loginUrl)$(email)/$(pass)`); */
           return axios.post(`/login/$(email)/$(pass)`);
    }

//createDeals
    static createDeals(dealObj) {
        return axios.post(url, dealObj);
    }


//updateDeals
//eslint-disable-next-line
    static updateDeals(id, text) {
        return axios.put(`$(url)$(id)/$(text)`);
    }


//deleteDeals
//eslint-disable-next-line
    static deleteDeals(id) {
        return axios.delete(`$(url)$(id)`);
    }

}

export default DealsService;