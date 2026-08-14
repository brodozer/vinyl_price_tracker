export function deleteRelease(db, releaseId) {
    const id = Number(releaseId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('releaseId должен быть положительным числом');
    }

    const result = db
        .prepare(
            `
        DELETE FROM releases
        WHERE id = ?
    `,
        )
        .run(id);

    if (result.changes === 0) {
        throw new Error(`Релиз с id ${id} не найден`);
    }

    return { releaseId: id };
}
