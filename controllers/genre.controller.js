import { genreService } from '../services/genre.service.js';
import { catchAsync } from '../utils/errors.js';

export const getAllGenres = catchAsync(async (req, res) => {
    const genres = await genreService.getAllGenres();
    res.json({
        success: true,
        data: genres
    });
});
