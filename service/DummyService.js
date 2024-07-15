export const DummyService = {
    getTagihanData() {
        return [
            // {
            //     id: 1000,
            //     name: 'James Butt',
            //     country: {
            //         name: 'Algeria',
            //         code: 'dz'
            //     },
            //     company: 'Benton, John B Jr',
            //     date: '2015-09-13',
            //     status: 'unqualified',
            //     verified: true,
            //     activity: 17,
            //     representative: {
            //         name: 'Ioni Bowcher',
            //         image: 'ionibowcher.png'
            //     },
            //     balance: 70663
            // },
            {
                kode : '375/A/2024/13',
                klien : 'PT. ABC',
                jumlah : '100.000.000',
                kontak : '08123456789',
            },
            {
                kode : '375/A/2024/14',
                klien : 'PT. ABC',
                jumlah : '100.000.000',
                kontak : '08123456789',
            },
            {
                kode : '375/A/2024/15',
                klien : 'PT. ABC',
                jumlah : '100.000.000',
                kontak : '08123456789',
            },{
                kode : '375/A/2024/16',
                klien : 'PT. ABC',
                jumlah : '100.000.000',
                kontak : '08123456789',
            },{
                kode : '375/A/2024/17',
                klien : 'PT. ABC',
                jumlah : '100.000.000',
                kontak : '08123456789',
            },{
                kode : '375/A/2024/18',
                klien : 'PT. ABC',
                jumlah : '100.000.000',
                kontak : '08123456789',
            },{
                kode : '375/A/2024/19',
                klien : 'PT. ABC',
                jumlah : '100.000.000',
                kontak : '08123456789',
            },
        ];
    },

    getStokBarang() {
        return [
            {
                no : 1,
                barang : 'Long drut 3/4"',
                stok : '97',
                status : 'Tersedia',
            },
            {
                no : 2,
                barang : 'mur baut 5/6"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 3,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 4,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 5,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 6,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 7,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 8,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 9,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
            {
                no : 10,
                barang : 'Long drut 3/4"',
                stok : '100',
                status : 'Tersedia',
            },
        ];
    },

    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    },

    getCustomers(params) {
        const queryParams = params
            ? Object.keys(params)
                  .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                  .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
    }
};