---
title: "پسورد Docker را encode کن!"
description: "چطور بعد از Docker login اطلاعات رجیستری را با pass و Docker Credential Helper از config.json خارج کنیم."
pubDate: 2024-10-04
tags: ["docker", "security", "registry", "linux"]
language: "fa"
draft: false
---

سلام. تو این نوشته می‌خوام درباره‌ی حل یک مشکل، در زمانی که از Docker برای deploy پروژه استفاده می‌کنید بنویسم.

![Docker credentials](https://files.virgool.io/upload/users/36136/posts/ruvubaax5jjb/rj3dplfzgn4r.webp)

به طور جزئی‌تر بخوام توضیح بدم، وقتی در یک سرور پروژه رو با Docker آورده باشید بالا، احتمالاً قبلش از دستور `docker login` استفاده کردید. در نتیجه username و password مربوط به container registry مد نظرتون در مسیر زیر ذخیره شده:

```text
~/.docker/config.json
```

اگر فایل بالا رو باز کنیم با محتوایی شبیه به کانفیگ زیر روبه‌رو می‌شیم:

![Docker config file](https://files.virgool.io/upload/users/36136/posts/ruvubaax5jjb/eot9kpl1my7t.png)

تو کانفیگ فایل بالا در قسمت `auth`، داکر username و password شما رو برای لاگین شدن به container registry به شکل base64 ذخیره کرده تا بتونه از اون رجیستری Docker imageها رو pull یا push کنه. در نهایت نتیجه اینه که خیلی راحت می‌شه به username و password رسید.

حالا تصور کنید در محیطی که کار می‌کنید authentication به وسیله‌ی یک LDAP انجام می‌شه؛ پس با اون password می‌شه به همه‌ی سرویس‌های پشت LDAP لاگین کرد.

## راه‌حل چیست؟

داکر استفاده از Credential store رو پیشنهاد داده. Credential store مناسب برای **سرورهای لینوکسی**، [pass](https://www.passwordstore.org/) نام داره. `pass` یک password manager برای محیط‌های Unix به شمار می‌ره و با گرفتن یک کلید از GPG پسوردهای شما رو encode می‌کنه.

در قدم اول نیاز هست که خود `pass` نصب بشه. پکیج `pass` در repository اکثر توزیع‌های محبوب وجود داره. مثلاً در Debian-basedها با فرمان زیر می‌شه اون رو نصب کرد:

```bash
sudo apt update
sudo apt install pass
```

بعد از نصب password manager باید [docker-credential-pass](https://github.com/docker/docker-credential-helpers/releases) رو نصب کنید. این ابزار واسط بین سرویس Docker و `pass` به شمار می‌ره. نسخه‌ی مناسب سیستم‌عامل و معماری مد نظرتون رو از صفحه‌ی releaseها پیدا و دانلود کنید:

```bash
wget https://github.com/docker/docker-credential-helpers/releases/download/v0.8.2/docker-credential-pass-v0.8.2.linux-amd64
```

> در اینجا نسخه‌ی ذکرشده `0.8.2` هست. شما می‌تونید آخرین نسخه‌ی منتشرشده یا هر نسخه‌ی دیگه‌ای رو که می‌خواید دانلود کنید.

اسم فایل دانلودشده حتماً باید فاقد شماره‌ی نسخه و توضیحات اضافی باشه؛ یعنی دقیقاً `docker-credential-pass`. پس فایل رو تغییر نام می‌دیم:

```bash
sudo mv ./docker-credential-pass-v0.8.2.linux-amd64 /usr/bin/docker-credential-pass
```

فایل دانلودشده در هر مسیری برای Docker قابل استفاده است، به شرطی که اون مسیر داخل `PATH` باشه. برای همین با فرمان بالا فایل رو علاوه بر تغییر نام به مسیر `/usr/bin` هم منتقل کردم.

در آخر باید فایل رو executable کنیم:

```bash
sudo chmod +x /usr/bin/docker-credential-pass
```

در قدم بعدی لازم هست یک کلید با GPG بسازیم:

```bash
gpg --full-generate-key
```

خروجی دستور بالا شامل یک public key هست. کلید رو کپی می‌کنیم تا در دستور زیر ازش استفاده کنیم:

```bash
pass init <public-key>
```

با دستور بالا یک password store ساخته می‌شه و در نتیجه مسیر زیر به وجود میاد:

```text
~/.password-store/
```

همه‌ی پسوردهای مربوط به Docker هم در مسیر زیر قابل مشاهده هستن:

```text
~/.password-store/docker-credential-helpers/
```

حالا همه‌چیز آماده است تا Docker از `pass` استفاده کنه.

## اتصال Docker به pass

برای اینکه از Docker بخوایم از `pass` استفاده کنه، در قدم اول باید از container registryها logout کنیم. بعد خط زیر رو به فایل `~/.docker/config.json` اضافه می‌کنیم:

```json
{
  "credsStore": "pass"
}
```

![Docker credsStore configuration](https://files.virgool.io/upload/users/36136/posts/ruvubaax5jjb/ln9ffz4ninyt.png)

حالا با login کردن به container registry، مثلاً Docker Hub، می‌بینیم که دیگه خبری از username و password نیست و Docker مشخصات container registry رو این‌طور در فایل کانفیگ می‌نویسه:

![Docker config after login](https://files.virgool.io/upload/users/36136/posts/ruvubaax5jjb/lvkz1b7gmcfb.png)

در فایل‌سیستم هم ساختار password store به شکل زیر می‌شه:

![ساختار password store](https://files.virgool.io/upload/users/36136/posts/ruvubaax5jjb/nxajmaaj7aa4.jpg)

برای آدرس هر container registry به شکل base64 یک دایرکتوری ساخته می‌شه. هر کدوم از این مسیرها شامل فایل‌هایی هستن که اسم فایل‌ها username کاربرهای login کرده و محتوای هر فایل هم پسورد encode شده‌ی متناسب با اون username است.

امیدوارم این مطلب براتون مفید بوده باشه. اگر قلم یا توضیحاتم واضح یا کافی نبود، برای بهتر شدنش پیشنهادتون رو مطرح کنید.

ممنون که وقت گذاشتید و خوندید.

_این نوشته ابتدا در [ویرگول](https://virgool.io/@nullamix/docker-credential-ruvubaax5jjb) منتشر شده است._
