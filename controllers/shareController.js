import { prisma } from "../lib/prisma.js";

export async function getShareById(req, res) {
    const { share } = res.locals;

    const folder = await prisma.folder.findUnique({
        where: { id: share.folderId },
        include: { files: { orderBy: { createdAt: "desc" } } },
    });

    res.render("share/show", { folder, share });
}

