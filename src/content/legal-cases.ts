import type { Localized } from '@/lib/i18n'

export const legalTitle = { he: 'הערוץ המשפטי של נבחרות', en: 'Nivcharot’s legal advocacy' }
export const legalLead = {
  he: 'מה קורה כשאישה חרדית מבקשת להתפקד למפלגה? נבחרות מלווה נשים שפנו לבתי המשפט כדי שיוכלו להגיש בקשת חברות ולקבל עליה תשובה. כאן מרוכזים ההליכים, ההכרעות והמסמכים.',
  en: 'What happens when a Haredi woman applies to join a political party? Nivcharot has supported women who went to court for a way to submit a membership application and have it considered. Explore their cases and read the judgments.',
}
export const knessetPaper = 'https://fs.knesset.gov.il/25/Committees/25_cs_bg_1839151.pdf'

type LegalCase = {
  slug: string
  title: Localized
  reference: Localized
  summary: Localized
  sections: { heading: Localized; body: Localized; source?: { label: Localized; url: string } }[]
}

export const legalCases: LegalCase[] = [
  {
    slug: 'agudat-yisrael',
    title: { he: 'חברות נשים באגודת ישראל', en: 'Women’s membership in Agudat Yisrael' },
    reference: { he: 'בג״ץ 1823/15 · ת״א 7322-08-22', en: 'HCJ 1823/15 · Civil case 7322-08-22' },
    summary: {
      he: 'שני הליכים עסקו בחברות נשים באגודת ישראל. הראשון שינה את נוסח התקנון. השני עסק בדרך שבה אישה יכולה להגיש מועמדות כשהמפלגה אינה מקיימת מפקד.',
      en: 'Two cases addressed membership in Agudat Yisrael. The first changed the wording of the party charter. The second asked how women could apply in practice when the party held no membership drive.',
    },
    sections: [
      {
        heading: { he: '2019 · שינוי תנאי החברות בתקנון', en: '2019 · Changing the membership clause' },
        body: {
          he: 'בעתירה שהגישה עו״ד תמר בן־פורת ב־2015 נבחנה הוראה שהגדירה מי יכול להיות חבר במפלגה. ב־10 בינואר 2019 נתן בג״ץ תוקף להתחייבות אגודת ישראל למחוק את המילה „איש” מסעיף 6(א) בתוך 21 יום. הוא נתן תוקף גם להצהרת המפלגה שהסעיף העוסק בתנועת „נשי אגודת ישראל” מאפשר לאישה להיות חברה במפלגה עצמה.',
          en: 'A petition filed by Tamar Ben-Porat in 2015 challenged the charter’s membership clause. On 10 January 2019 the High Court gave legal effect to the party’s undertaking to remove the word “man” from clause 6(a) within 21 days. It also recorded the party’s declaration that the separate women’s organisation presented no barrier to membership in the party itself.',
        },
        source: { label: { he: 'פסק הדין של בג״ץ, 10.1.2019 (PDF)', en: 'High Court judgment, 10 January 2019 (Hebrew PDF)' }, url: 'https://rackmancenter.com/wp-content/uploads/2019/01/%D7%A4%D7%A1%D7%93-%D7%91%D7%9F-%D7%A4%D7%95%D7%A8%D7%AA.pdf' },
      },
      {
        heading: { he: '2026 · הדרך להגשת בקשת חברות', en: '2026 · A practical route to membership' },
        body: {
          he: 'לאחר שנשים ביקשו להצטרף, הן פנו עם נבחרות לבית המשפט המחוזי בתל אביב–יפו. ב־29 באוקטובר 2026 קיבלה השופטת רחל ברקאי את התביעה בחלקה. היא קבעה שהמפלגה הפרה את תקנונה ואת סעיף 14 לחוק המפלגות, והורתה לה ליצור בתוך 12 חודשים את התנאים הדרושים לעריכת מפקד חברים. ההחלטה על כל בקשת חברות נשארה בידי מוסדות המפלגה.',
          en: 'Women who had applied to join brought their case to the Tel Aviv–Jaffa District Court with Nivcharot. On 29 October 2026 Judge Rachel Barkai partly upheld the claim. She found that the party had breached its charter and section 14 of the Parties Law and ordered it to establish the conditions for a membership drive within 12 months. Individual applications remained for the party’s institutions to decide.',
        },
        source: { label: { he: 'פסק הדין המחוזי, 29.10.2026', en: 'District Court judgment, 29 October 2026 (Hebrew)' }, url: 'https://psikan.com/rulings/district-1030dd5c454a2b02-%D7%AA%D7%90-7322-08-22' },
      },
    ],
  },
  {
    slug: 'shas',
    title: { he: 'בקשות החברות של נשים בש״ס', en: 'Women’s applications to join Shas' },
    reference: { he: 'מחוזי ירושלים · ת״א 31083-08-22', en: 'Jerusalem District Court · Civil case 31083-08-22' },
    summary: {
      he: 'נשים חרדיות ביקשו להצטרף לש״ס. התביעה שהגישו עם נבחרות עסקה בשאלה מעשית: איך מגישים בקשה לחברות כאשר התקנון מתיר קבלת חברים, אבל אין דרך להשלים את התהליך?',
      en: 'Haredi women sought to join Shas. Their claim with Nivcharot raised a practical question. How could an applicant complete the membership process when the party charter provided for admissions but the procedure was unavailable?',
    },
    sections: [
      {
        heading: { he: '2022 · בקשת התובעות', en: '2022 · What the claimants asked for' },
        body: {
          he: 'התובעות ביקשו שבית המשפט יורה לש״ס לקבל אותן כחברות. הדיון עסק בהוראות סעיף 4 לתקנון ובתפקיד הנהלת המפלגה בניסוח ההצהרה שעל המועמדים להגיש. נבחרות תיארה את הרקע לפנייה לבית המשפט בנייר עמדה שהגישה לכנסת.',
          en: 'The claimants asked the court to order Shas to admit them. The proceedings examined section 4 of the charter and the party leadership’s role in drawing up the declaration required of applicants. Nivcharot described the background in a position paper submitted to the Knesset.',
        },
        source: { label: { he: 'נייר העמדה של נבחרות באתר הכנסת (PDF)', en: 'Nivcharot’s paper in the Knesset archive (Hebrew PDF)' }, url: knessetPaper },
      },
      {
        heading: { he: '2025 · פסק הדין בירושלים', en: '2025 · The Jerusalem ruling' },
        body: {
          he: 'ב־24 בדצמבר 2025 קיבלה השופטת תמר בזק־רפפורט את התביעה בחלקה. היא הורתה לש״ס ליצור את התנאים הדרושים לקבלת חברות וחברים לפי סעיף 4 לתקנון. בית המשפט דחה את הבקשה לקבל את התובעות עצמן למפלגה באותו מעמד. כך הבחין בין חובת המפלגה לאפשר הגשת מועמדות ובין ההחלטה בבקשה של כל מועמדת.',
          en: 'On 24 December 2025 Judge Tamar Bezek-Rappaport partly upheld the claim. She ordered Shas to put in place the conditions needed to admit members under section 4 of its charter. The court declined to enrol the claimants directly. The judgment distinguishes access to an application process from the decision on an individual application.',
        },
        source: { label: { he: 'פסק הדין המחוזי, 24.12.2025 (PDF)', en: 'District Court judgment, 24 December 2025 (Hebrew PDF)' }, url: 'https://img.haarets.co.il/bs/0000019b-63f8-d866-abff-7bf9d4ec0000/e2/54/cfd469e7468caf6af240551c176c/psd-sahs.pdf' },
      },
    ],
  },
]
