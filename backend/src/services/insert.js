import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';
import specialty from '../../data/specialty.json'
import { toSlug } from '../utils/toSlug';

const insertSpecialty = async () => {
    try {
        for (const item of specialty.data) {
            await db.Specialty.create({
                id: uuidv4(),
                name: item.name,
                images: item.image,
                slug: toSlug(item.name)
            })
        }

        return {
            err: 0,
            message: "insert specialty success!"
        }

    } catch (error) {
        console.log("Lỗi ở insertSpecialty: ", error);
        return {
            err: -999,
            message: `Error server : ${error}`
        }
    }
}

export { insertSpecialty }