import { AuditLogEvent, Events, time } from "discord.js";
import { row3 } from "../../components/selectMenus/issue-select-menu-states.js";
import { lockButton } from "../../components/modals/create-issue-title.js";

export default {
    name: Events.ThreadUpdate,
    once: false,
    execute: async (oldThread, newThread) => {
        if (oldThread.archived && !newThread.archived) {
            const formattedTime = time(new Date(), "R");

            const auditLogs = await newThread.guild.fetchAuditLogs({
                type: AuditLogEvent.ThreadUpdate,
            });
            const auditLog = auditLogs.entries.first();

            if (!auditLog) return;

            const { executor } = auditLog;

            await newThread.send({
                content: `<:issue_reopen:1097285719577342002> **${executor.username}** __reopened__ this ${formattedTime}`,
            });

            const pinnedMessages = await newThread.messages.fetchPinned();
            const pinnedMessage = pinnedMessages.first();

            if (pinnedMessage) {
                await pinnedMessage.edit({
                    components: [row3, lockButton],
                });
            } else {
                const messages = await newThread.messages.fetch();
                const message = messages.first();

                if (message) {
                    await message.edit({
                        components: [row3, lockButton],
                    });
                }
            }
        }
    },
};