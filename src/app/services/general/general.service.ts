import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GeneralService {

    constructor() { }

    pushObjectsInUnique(obj, arr, prop) {
        if (!this.findIntoArrayofObject(obj[prop], arr, prop)) {
            arr.push(obj);
        }
        return arr;
    }

    mergeObjectsInUnique(arr, prop) {
        const newArray = new Map();

        arr.forEach((item) => {
            const propertyValue = item[prop];
            // tslint:disable-next-line:max-line-length
            newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
        });

        return Array.from(newArray.values());
    }

    compareArrayofObject(arr1, arr2, prop) {
        let arr = [];
        arr = arr1.filter((item1) => {
            return arr2.filter(item2 => item2[prop] === item1[prop]).length;
        });
        return arr;
    }

    sortArrayOfObject(arr, prop, method = 1) {
        function compare(a, b) {
            let comparison = 0;
            if (a[prop] > b[prop]) {
                comparison = 1;
            } else if (a[prop] < b[prop]) {
                comparison = -1;
            }
            return (method === 1) ? comparison : comparison * -1;
        }
        return arr.sort(compare);
    }

    findIntoArrayofObject(value, arr, prop) {
        let results;
        if (Array.isArray(value)) {
            results = [];
            // tslint:disable-next-line:variable-name
            value.forEach((_value) => {
                const find = arr.find(item => item[prop] === _value);
                if (find) {
                    results.push(find);
                }
            });
        } else {
            results = (arr.length) ? arr.find(item => item[prop] === value) : false;
        }
        return results;
    }

    removeObjectFromArray(value, arr, prop) {
        const index = arr.map((item) => item[prop]).indexOf(value);
        if (index !== -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    mapArray(arr, prop) {
        return arr.map(value => value[prop]);
    }
}
