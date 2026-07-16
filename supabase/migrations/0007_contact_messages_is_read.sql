-- contact_messages cədvəlinə is_read sütunu (admin panel "Əlaqə mesajları"
-- bölməsi bunu tələb edir, əvvəlki miqrasiyada unudulmuşdu)
alter table contact_messages add column if not exists is_read boolean not null default false;