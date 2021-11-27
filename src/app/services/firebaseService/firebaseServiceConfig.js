const prodConfig = {

};

const devConfig = {

};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
