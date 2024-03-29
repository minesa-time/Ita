import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";
import {
    exclamationmark_triangleEmoji,
    person_profile,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import { EMBED_COLOR } from "../../config.js";

export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            ChineseCN: "用户头像",
            it: "Avatar Utente",
            tr: "Kullanıcı Avatarı",
        })
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.UseExternalEmojis
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.EmbedLinks
            )
        )
            return;

        try {
            await interaction.deferReply({ ephemeral: true });

            const target = interaction.guild.members.cache.get(
                interaction.targetId
            );
            const avatar = target.user.displayAvatarURL({
                size: 4096,
            });

            const embed = new EmbedBuilder()
                .setDescription(
                    `# ${person_profile} @${target.user.username}\nYou are viewing their profile picture now.`
                )
                .setImage(avatar)
                .setColor(EMBED_COLOR);

            await interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (error) {
            return interaction.editReply({
                content: `${exclamationmark_triangleEmoji} Are we sure they are a member in this guild?`,
                ephemeral: true,
            });
        }
    },
};
