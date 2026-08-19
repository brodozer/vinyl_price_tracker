SELECT artist, album, price, currency, release_date FROM records;

-- price history by record ID
-- SELECT
--     r.artist,
--     r.album,
--     ph.price,
--     ph.currency,
--     ph.checked_at
-- FROM records AS r
-- JOIN price_history AS ph
--     ON ph.record_id = r.id
-- WHERE r.id = 1
-- ORDER BY ph.checked_at DESC;

-- UPDATE records 
-- SET url = 'https://www.gramodesky.cz/album/motley-crue-dr-feelgood-1989-7656' 
-- WHERE id = 14;




