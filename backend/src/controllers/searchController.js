import { search } from "../services/searchService";

const handleSearch = async (req, res) => {
    try {
        const { value, filter } = req.query
        const message = await search(value, filter)

        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleSearch !");

    }
}

export{handleSearch}