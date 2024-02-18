import {
    EmbedBuilder,
    WebhookClient,
    ActionRowBuilder,
    ButtonBuilder,
    AttachmentBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { inspect } from "util";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("— Developer only.")
        .setNameLocalizations({
            tr: "değerlendir",
            it: "valutare",
            ChineseCN: "评估",
        })
        .setDescriptionLocalizations({
            tr: "— Sadece geliştiriciler için.",
            it: "— Solo per sviluppatori.",
            ChineseCN: "— 仅限开发人员。",
        })
        .addStringOption((option) =>
            option
                .setName("input")
                .setDescription("• Please input the code.")
                .setRequired(true)
                .setNameLocalizations({
                    tr: "girdi",
                    it: "input",
                    ChineseCN: "输入",
                })
                .setDescriptionLocalizations({
                    tr: "• Lütfen kodu girin.",
                    it: "• Inserisci il codice.",
                    ChineseCN: "• 请输入代码。",
                }),
        ),
    async execute({ interaction, client }) {
        // Defining the client, guild, channel, member, and user
        let channel = interaction.channel;
        let guild = interaction.guild;
        let member = interaction.member;
        let user = interaction.user;

        // If the user is not Neo, return nothing.
        if (!"285118390031351809".includes(interaction.member.user.id))
            return interaction.reply({
                content: `You can not use this command.`,
                ephemeral: true,
            });

        // The input and output
        try {
            let evaluated = eval(interaction.options.getString("input"));
            evaluated =
                typeof evaluated === "object"
                    ? inspect(evaluated, { depth: 0, showHidden: false })
                    : evaluated;

            return interaction.reply({
                content: `**Output**\n\n>>> ***\`\`\`javascript\n${evaluated}\n\`\`\`***`,
            });
        } catch (error) {
            return interaction.reply({
                content: `An error occurred: \`${error.message}\``,
            });
        }
    },
};
