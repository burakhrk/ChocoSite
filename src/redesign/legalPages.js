// Yasal sayfaların metinleri. Şirket bilgileri yönetim panelinden gelir;
// boş bırakılan alanlar köşeli parantezle gösterilir ki eksik olduğu belli olsun.
export const LEGAL_PAGES = [
  { slug: 'guvenli-alisveris', title: 'Güvenli Alışveriş' },
  { slug: 'kvkk', title: 'KVKK Bilgilendirmesi' },
  { slug: 'mesafeli-satis-sozlesmesi', title: 'Mesafeli Satış Sözleşmesi ve İade Politikası' },
  { slug: 'teslimat-ve-iade', title: 'Teslimat ve İade' },
  { slug: 'gizlilik', title: 'Gizlilik ve Çerez Politikası' },
];

export const legalHref = (slug) => `#/sayfa/${slug}`;

const companyInfo = (site) => ({
  name: site.companyName || '[Şirket unvanı]',
  address: site.companyAddress || '[Şirket adresi]',
  email: site.companyEmail || '[E-posta adresi]',
  tax: site.companyTax || '[Vergi dairesi ve numarası]',
  phone: site.phone,
});

const PAGE_SECTIONS = {
  'guvenli-alisveris': (c) => [
    {
      heading: 'Siparişiniz nasıl tamamlanır?',
      paragraphs: [
        'ChocoSite üzerinden seçtiğiniz ürünler sepetinizde toplanır ve siparişiniz WhatsApp üzerinden bize iletilir. Sipariş, ekibimiz tarafından WhatsApp\'ta onaylandığında kesinleşir; ürün, tutar ve teslimat zamanı bu yazışmada netleştirilir.',
      ],
    },
    {
      heading: 'Ödeme bilgileriniz',
      paragraphs: [
        'Sitemizde şu anda çevrimiçi ödeme alınmamaktadır; bu nedenle site üzerinde kart numarası, son kullanma tarihi veya güvenlik kodu gibi hiçbir ödeme bilgisi istenmez ve saklanmaz. Ödeme yöntemi sipariş onayı sırasında WhatsApp üzerinden sizinle birlikte belirlenir.',
        'Çevrimiçi kart ödemesi devreye alındığında işlemler yetkili bir ödeme kuruluşunun altyapısında gerçekleşecek, kart bilgileriniz ChocoSite tarafından görülmeyecek ve saklanmayacaktır.',
        'Sizden WhatsApp, telefon veya e-posta yoluyla kart şifrenizi ya da tek kullanımlık onay kodunuzu asla istemeyiz. Böyle bir taleple karşılaşırsanız lütfen bilgi paylaşmayın ve bize haber verin.',
      ],
    },
    {
      heading: 'Bağlantı güvenliği',
      paragraphs: [
        'Sitemize yapılan tüm bağlantılar şifreli (HTTPS) olarak kurulur. Sepetiniz yalnızca kendi cihazınızda tutulur; sipariş formuna yazdığınız bilgiler sitemizde saklanmaz, yalnızca sizin başlattığınız WhatsApp mesajının içinde bize ulaşır.',
      ],
    },
    {
      heading: 'Bize ulaşın',
      paragraphs: [
        `Siparişinizle ilgili her konuda ${c.phone} numaralı telefondan veya WhatsApp hattımızdan bize ulaşabilirsiniz. Satıcı: ${c.name}, ${c.address}.`,
      ],
    },
  ],

  kvkk: (c) => [
    {
      heading: 'Veri sorumlusu',
      paragraphs: [
        `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla ${c.name} (${c.address}) tarafından aşağıda açıklanan çerçevede işlenmektedir.`,
      ],
    },
    {
      heading: 'İşlenen kişisel veriler',
      paragraphs: [
        'Sipariş verirken paylaştığınız ad ve soyad, telefon numarası, teslimat adresi, hediyenin teslim edileceği kişinin adı, kart notu ve sipariş içeriği işlenir. Hediye gönderiminde alıcıya ait ad ve adres bilgisini bizimle paylaşarak bu bilgiyi paylaşmaya yetkili olduğunuzu kabul edersiniz.',
        'Onay vermeniz halinde, sitedeki gezinme ve sepet hareketlerinize ilişkin çerez verileri de işlenir. Ayrıntılar Gizlilik ve Çerez Politikası sayfasındadır.',
      ],
    },
    {
      heading: 'İşleme amaçları ve hukuki sebepler',
      paragraphs: [
        'Verileriniz; siparişin alınması, hazırlanması ve teslim edilmesi, sipariş hakkında sizinle iletişim kurulması ve satış sonrası taleplerin yanıtlanması amacıyla, bir sözleşmenin kurulması veya ifası için gerekli olması (KVKK md. 5/2-c) hukuki sebebine dayanılarak işlenir.',
        'Fatura düzenlenmesi ve yasal saklama yükümlülükleri bakımından hukuki yükümlülüğün yerine getirilmesi (md. 5/2-ç); reklam ve ölçüm çerezleri bakımından ise açık rızanız (md. 5/1) esas alınır.',
      ],
    },
    {
      heading: 'Verilerin aktarılması',
      paragraphs: [
        'Teslimatın yapılabilmesi için gerekli bilgiler teslimatı gerçekleştiren personel veya kurye ile paylaşılır. Siparişler WhatsApp üzerinden iletildiği için yazışma içeriği, sunucuları yurt dışında bulunan WhatsApp (Meta Platforms) altyapısında yer alır. Verileriniz yasal zorunluluk halleri dışında başka üçüncü kişilerle paylaşılmaz ve satılmaz.',
      ],
    },
    {
      heading: 'Saklama süresi',
      paragraphs: [
        'Sipariş kayıtları, ilgili mevzuatta öngörülen süreler boyunca saklanır; bu sürelerin sonunda silinir, yok edilir veya anonim hale getirilir.',
      ],
    },
    {
      heading: 'Haklarınız',
      paragraphs: [
        'KVKK\'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, şartları oluştuğunda silinmesini isteme, bu işlemlerin aktarılan kişilere bildirilmesini isteme, otomatik sistemlerle analiz sonucu aleyhinize çıkan sonuca itiraz etme ve zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz.',
        `Başvurularınızı ${c.email} adresine veya ${c.address} adresine yazılı olarak iletebilirsiniz. Başvurunuz en geç otuz gün içinde yanıtlanır.`,
      ],
    },
  ],

  'mesafeli-satis-sozlesmesi': (c) => [
    {
      heading: '1. Taraflar',
      paragraphs: [
        `Satıcı: ${c.name}. Adres: ${c.address}. Telefon: ${c.phone}. E-posta: ${c.email}. Vergi bilgisi: ${c.tax}.`,
        'Alıcı: Sipariş sırasında adı, telefonu ve adresi bildirilen kişi. Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine göre düzenlenmiştir.',
      ],
    },
    {
      heading: '2. Konu ve ürün bilgileri',
      paragraphs: [
        'Sözleşmenin konusu, Alıcı\'nın ChocoSite üzerinden seçip WhatsApp aracılığıyla siparişini verdiği ürünlerin satışı ve teslimidir. Ürünlerin türü, adedi, vergiler dahil satış bedeli ve varsa teslimat bedeli, sipariş onayı sırasında Alıcı\'ya yazılı olarak bildirilir. Sitede gösterilen fiyatlar, sipariş onaylanana kadar değiştirilebilir.',
      ],
    },
    {
      heading: '3. Siparişin kurulması ve ödeme',
      paragraphs: [
        'Sipariş, Satıcı\'nın WhatsApp üzerinden onay vermesiyle kurulur. Ödeme yöntemi ve zamanı bu onay sırasında taraflarca belirlenir. Satıcı, haklı bir nedenle siparişi yerine getiremeyeceğini öğrendiğinde Alıcı\'yı gecikmeksizin bilgilendirir ve tahsil edilmiş bedel varsa en geç on dört gün içinde iade eder.',
      ],
    },
    {
      heading: '4. Teslimat',
      paragraphs: [
        'Teslimat yalnızca Denizli il sınırları içinde, Alıcı\'nın bildirdiği adrese ve kişiye yapılır. Teslimat günü ve saati sipariş onayında kararlaştırılır. Alıcı\'nın veya teslim alacak kişinin adreste bulunmaması, adresin eksik ya da hatalı bildirilmesi nedeniyle teslimatın yapılamamasından Satıcı sorumlu değildir; ürünlerin çabuk bozulabilir nitelikte olması nedeniyle bu durumda yeniden gönderim ek bedele tabi olabilir.',
      ],
    },
    {
      heading: '5. Cayma hakkı',
      paragraphs: [
        'Mesafeli Sözleşmeler Yönetmeliği\'nin 15. maddesi uyarınca; çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünlerde ve Alıcı\'nın istekleri doğrultusunda kişiye özel hazırlanan ürünlerde cayma hakkı kullanılamaz. Çikolata, pasta, çiçek ve kişiye özel hazırlanan hediye kutuları bu kapsamdadır.',
        'Bu istisnaların kapsamına girmeyen ürünlerde Alıcı, teslimden itibaren on dört gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir; ürünün kullanılmamış ve yeniden satılabilir durumda iade edilmesi gerekir.',
      ],
    },
    {
      heading: '6. İptal, ayıplı ürün ve iade',
      paragraphs: [
        'Hazırlığına başlanmamış siparişler için iptal talebinizi WhatsApp hattımızdan iletebilirsiniz. Hazırlığına başlanmış veya yola çıkmış siparişler, ürünlerin niteliği gereği iptal edilemeyebilir.',
        'Ürünün hasarlı, eksik ya da siparişten farklı teslim edilmesi halinde, ürünler çabuk bozulabilir olduğundan teslimattan sonra mümkün olan en kısa sürede fotoğrafla birlikte bize bildirmenizi rica ederiz. İnceleme sonucunda tercihinize göre ürün yenisiyle değiştirilir veya bedeli, ödemenin yapıldığı yöntemle iade edilir. Tüketicinin ayıplı mala ilişkin yasal hakları saklıdır.',
      ],
    },
    {
      heading: '7. Uyuşmazlıkların çözümü',
      paragraphs: [
        'Bu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı\'nca her yıl ilan edilen parasal sınırlar dahilinde Alıcı\'nın yerleşim yerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.',
      ],
    },
    {
      heading: '8. Yürürlük',
      paragraphs: [
        'Alıcı, siparişini onaylamakla bu sözleşmenin tüm koşullarını okuduğunu ve kabul ettiğini beyan eder.',
      ],
    },
  ],

  'teslimat-ve-iade': (c) => [
    {
      heading: 'Teslimat bölgesi',
      paragraphs: [
        'Şu anda yalnızca Denizli içine teslimat yapıyoruz. Adresinizin teslimat alanımızda olup olmadığından emin değilseniz sipariş öncesinde WhatsApp hattımızdan sorabilirsiniz.',
      ],
    },
    {
      heading: 'Teslimat zamanı',
      paragraphs: [
        'Siparişler Denizli içinde aynı gün teslim edilir. Sepette dilediğiniz günü ve saati seçebilirsiniz; uygunluk, sipariş onayı sırasında WhatsApp üzerinden teyit edilir. İleri tarihli siparişler seçtiğiniz günde teslim edilir.',
        'Teslimat bedeli varsa sipariş onayında toplam tutarla birlikte bildirilir.',
      ],
    },
    {
      heading: 'Teslim sırasında',
      paragraphs: [
        'Hediyeniz, belirttiğiniz kişiye ve adrese teslim edilir. Alıcı adreste yoksa sizinle iletişime geçeriz. Ürünler çabuk bozulabilir olduğundan, adres veya telefon bilgisinin eksiksiz ve doğru olması çok önemlidir.',
        'Paketi teslim alırken lütfen kontrol edin; hasar veya eksik fark ederseniz hemen bize bildirin.',
      ],
    },
    {
      heading: 'İptal',
      paragraphs: [
        'Hazırlığına başlanmamış siparişleri iptal edebilirsiniz. Ürünler siparişe özel hazırlandığı için hazırlığına başlanmış siparişlerde iptal mümkün olmayabilir.',
      ],
    },
    {
      heading: 'İade ve değişim',
      paragraphs: [
        'Çikolata, pasta ve çiçek gibi çabuk bozulabilen ürünlerde ve kişiye özel hazırlanan kutularda, mevzuat gereği cayma hakkı bulunmamaktadır.',
        'Ürün hasarlı, eksik veya siparişinizden farklı ulaştıysa teslimattan sonra en kısa sürede fotoğrafıyla birlikte bize yazın. Durumu inceleyip tercihinize göre ürünü yenisiyle değiştirir veya ücretini iade ederiz.',
        `İletişim: ${c.phone} (telefon ve WhatsApp).`,
      ],
    },
  ],

  gizlilik: (c) => [
    {
      heading: 'Kapsam',
      paragraphs: [
        `Bu politika, ${c.name} tarafından işletilen ChocoSite internet sitesini ziyaret ettiğinizde ve sipariş verdiğinizde bilgilerinizin nasıl kullanıldığını açıklar. Kişisel verilerinizin işlenmesine ilişkin ayrıntılı bilgi KVKK Bilgilendirmesi sayfasında yer alır.`,
      ],
    },
    {
      heading: 'Sitede topladığımız bilgiler',
      paragraphs: [
        'Sitemizde üyelik yoktur ve sizden hesap oluşturmanız istenmez. Sepetiniz yalnızca kendi tarayıcınızda saklanır. Sipariş formuna yazdığınız ad, telefon, adres ve kart notu sitemizde kaydedilmez; "WhatsApp ile tamamla" düğmesine bastığınızda hazırlanan mesajın içinde, sizin göndermenizle bize ulaşır.',
      ],
    },
    {
      heading: 'Çerezler ve benzeri teknolojiler',
      paragraphs: [
        'Zorunlu kayıtlar: Sepetinizin ve çerez tercihinizin hatırlanması için tarayıcınızın yerel depolama alanı kullanılır. Bunlar sitenin çalışması için gereklidir ve sizi tanımlamaz.',
        'Reklam ve ölçüm çerezleri: Onay vermeniz halinde Meta Pixel (Facebook / Instagram) çalışır. Bu araç; ziyaret ettiğiniz sayfaları, görüntülediğiniz ve sepete eklediğiniz ürünleri ve sipariş adımlarını Meta Platforms\'a iletir. Amaç, reklamlarımızın etkisini ölçmek ve ilginizi çekebilecek reklamlar göstermektir. Onay vermediğiniz sürece bu araç yüklenmez.',
        'Tercihinizi değiştirmek için tarayıcınızın site verilerini temizleyebilirsiniz; siteyi yeniden açtığınızda tercih sorusu tekrar gösterilir.',
      ],
    },
    {
      heading: 'Üçüncü taraf hizmetler',
      paragraphs: [
        'Site, GitHub Pages üzerinde barındırılır; ürün ve içerik bilgileri Supabase altyapısından okunur. Bu hizmetler, sayfanın size sunulabilmesi için IP adresi gibi teknik bağlantı bilgilerini işleyebilir. Siparişler WhatsApp üzerinden iletilir ve WhatsApp\'ın kendi gizlilik koşullarına tabidir.',
      ],
    },
    {
      heading: 'İletişim',
      paragraphs: [
        `Gizlilikle ilgili sorularınız için ${c.email} adresine yazabilir veya ${c.phone} numarasından bize ulaşabilirsiniz.`,
      ],
    },
  ],
};

export const legalPage = (slug, site) => {
  const page = LEGAL_PAGES.find((item) => item.slug === slug);
  if (!page) return null;
  return { ...page, sections: PAGE_SECTIONS[slug](companyInfo(site)) };
};
