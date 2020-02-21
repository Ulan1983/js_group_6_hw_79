const fs = require('fs');
const nanoid = require('nanoid');

const readFile = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
};

const filename = './items.json';
const category = './categories.json';
const location = './locations.json';

let data = [];
let categoryData = [];
let locationData = [];

module.exports = {
  async init() {
    try {
      const fileContents = await readFile(filename);
      const fileContentsCategory = await readFile(category);
      const fileContentsLocation = await readFile(location);
      data = JSON.parse(fileContents.toString());
      categoryData = JSON.parse(fileContentsCategory.toString());
      locationData = JSON.parse(fileContentsLocation.toString());
    } catch (e) {
      console.log('Could not read file ' + filename);
      console.log('Could not read file ' + category);
      console.log('Could not read file ' + location);
      data = [];
      categoryData = [];
      locationData = [];
    }
  },
  async getItems() {
    return data;
  },
  async getCategoryItems() {
    return categoryData;
  },
  async getLocationItems() {
    return locationData;
  },
  async getItemById(id) {
    return data.find(item => item.id === id);
  },
  async getCategoryItemById(id) {
    return categoryData.find(item => item.id === id);
  },
  async getLocationItemById(id) {
    return locationData.find(item => item.id === id);
  },
  async addItem(item) {
    item.id = nanoid();
    data.push(item);
    await this.save();
  },
  async addCategory(category) {
    category.id = nanoid();
    categoryData.push(category);
    await this.saveCategory();
  },
  async addLocation(location) {
    location.id = nanoid();
    locationData.push(location);
    await this.saveLocation();
  },
  async deleteItem(item) {
    const itemIndex = data.findIndex(i => i.id === item.id);
    data.splice(itemIndex, 1);
    await this.save();
  },
  async deleteCategory(category) {
    const itemIndex = categoryData.findIndex(i => i.id === category.id);
    for (let cat in categoryData) {
      if (categoryData[cat].id === data[cat].category_id) {
        throw new Error('Error');
      } else {
        categoryData.splice(itemIndex, 1);
        await this.saveCategory();
      }
    }
  },
  async deleteLocation(location) {
    const itemIndex = locationData.findIndex(i => i.id === location.id);
    for (let loc in locationData) {
      if (locationData[loc].id === data[loc].location_id) {
        throw new Error('Error');
      } else {
        locationData.splice(itemIndex, 1);
        await this.saveLocation();
      }
    }
  },
  async editItem(item) {
    const itemIndex = data.findIndex(i => i.id === item.id);
    data[itemIndex] = item;
    await this.save();
  },
  async save() {
    const fileContents = JSON.stringify(data, null, 2);
    await writeFile(filename, fileContents);
  },
  async saveCategory() {
    const fileContents = JSON.stringify(categoryData, null, 2);
    await writeFile(category, fileContents);
  },
  async saveLocation() {
    const fileContents = JSON.stringify(locationData, null, 2);
    await writeFile(location, fileContents);
  }
};