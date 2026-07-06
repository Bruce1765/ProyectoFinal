package app.services

import app.modelos.Producto
import java.io.{PrintWriter, File}

object InventarioService {
  // Base de datos en memoria sincronizada AL 100% con tu catálogo masivo JSON
  private var stockActual: List[Producto] = List(

    // === LICUADORAS ===
    Producto("LIC001", "Oster Reversible 2L", 350.0, 15, 22, "Licuadoras", "https://media.falabella.com/falabellaPE/15997683_1/w=1200,h=1200,fit=pad"),
    Producto("LIC002", "Philips Walita Pro", 220.0, 20, 20, "Licuadoras", "https://media.falabella.com/falabellaPE/119660660_01/w=1200,h=1200,fit=pad"),
    Producto("LIC003", "Black+Decker CrushMaster", 180.0, 12, 18, "Licuadoras", "https://media.falabella.com/falabellaPE/129584750_1/w=1200,h=1200,fit=pad"),
    Producto("LIC004", "Ninja Professional 1000W", 580.0, 8, 24, "Licuadoras", "https://media.falabella.com/tottusPE/43382624_1/w=1200,h=1200,fit=pad"),
    Producto("LIC005", "Moulinex PerfectMix+", 290.0, 10, 21, "Licuadoras", "https://www.tradeinn.com/f/14090/140907137/moulinex-licuadora-lm871d10.webp"),
    Producto("LIC006", "Taurus Optima Glass", 160.0, 25, 19, "Licuadoras", "https://www.electrodomesta.es/images/articulos/original/batidora_vaso_taurus_optima_glass_1416-1.jpg"),
    Producto("LIC007", "Imaco PowerBlender", 140.0, 30, 19, "Licuadoras", "https://oechsle.vteximg.com.br/arquivos/ids/21478100-1000-1000/imageUrl_1.jpg?v=638866894732200000"),
    Producto("LIC008", "Bosch VitaPower Serie 4", 420.0, 6, 23, "Licuadoras", "https://premiumhaus.pe/cdn/shop/files/MMB6382M_1.jpg?v=1762790119&width=600"),

    // === REFRIGERADORAS ===
    Producto("REF001", "LG TwinWash 450L", 1500.0, 10, 70, "Refrigeradoras", "https://www.lg.com/ar/images/heladeras/md07518566/gallery/D_01.jpg"),
    Producto("REF002", "Samsung Pro 600L", 2800.0, 7, 90, "Refrigeradoras", "https://images.samsung.com/is/image/samsung/pe-ref-fdsr-rf28r7351-rf28r7351sg-pe-frontblack-176867073?$1164_776_PNG$"),
    Producto("REF003", "Frigobar Indurama 90L", 650.0, 5, 50, "Refrigeradoras", "https://media.falabella.com/falabellaPE/138259968_02/w=1200,h=1200,fit=pad"),
    Producto("REF004", "Mabe Ahorradora 300L", 1100.0, 12, 65, "Refrigeradoras", "https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/r/e/refrigeradora-no-frost-300l-grafito-59652-default-1.jpg"),
    Producto("REF005", "Daewoo No Frost 250L", 950.0, 14, 60, "Refrigeradoras", "https://media.falabella.com/falabellaPE/16194200_2/w=1200,h=1200,fit=pad"),
    Producto("REF006", "Bosch Inverter 500L", 3200.0, 4, 85, "Refrigeradoras", "https://media.falabella.com/falabellaPE/135993316_01/w=1200,h=1200,fit=pad"),
    Producto("REF007", "Panasonic PrimeFresh 400L", 2100.0, 9, 75, "Refrigeradoras", "https://aaravelectronics.com/cdn/shop/files/71FxOSLYAL._SL1500.jpg?v=1766866777"),
    Producto("REF008", "Whirlpool Side by Side", 3900.0, 3, 95, "Refrigeradoras", "https://berrios.pr/cdn/shop/files/file_8d01da5b-fdf3-4c3f-aec3-7a640f4c4f64.jpg?v=1750968838&width=1680"),

    // === MICROONDAS ===
    Producto("MIC001", "Panasonic Digital 32L", 450.0, 18, 52, "Microondas", "https://http2.mlstatic.com/D_NQ_NP_645214-MLA45990974178_052021-O.webp"),
    Producto("MIC002", "Samsung Ceramic 23L", 380.0, 22, 49, "Microondas", "https://hiraoka.com.pe/media/catalog/product/1/3/133023_1.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=560&width=700&canvas=700:560"),
    Producto("MIC003", "LG Smart Inverter 42L", 620.0, 10, 54, "Microondas", "https://www.lg.com/content/dam/channel/wcms/pe/images/microondas/ms4296dir_bbkglpr_espr_pe_c/new-gallery/DZ-1.jpg/jcr:content/renditions/thum-1600x1062.jpeg?w=800"),
    Producto("MIC004", "Oster Mecánico 20L", 250.0, 30, 45, "Microondas", "https://media.falabella.com/falabellaPE/119580839_01/w=1200,h=1200,fit=pad"),
    Producto("MIC005", "Daewoo Espejo 28L", 340.0, 15, 51, "Microondas", "https://toolstoremexico.com.mx/img/p/4/5/9/459-large_default.jpg"),
    Producto("MIC006", "Winia Grill 20L", 280.0, 20, 46, "Microondas", "https://www.efe.com.pe/media/catalog/product/o/r/orig_1_887211.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700"),
    Producto("MIC007", "Imaco con Dorador 25L", 310.0, 12, 48, "Microondas", "https://media.falabella.com.pe/falabellaPE/152258609_01/width=170,height=170,quality=70,format=webp,fit=pad"),
    Producto("MIC008", "Mabe Inox 30L", 410.0, 8, 53, "Microondas", "https://mercury.vtexassets.com/arquivos/ids/8652222-800-800?v=637953190240030000&width=800&height=800&aspect=true"),

    // === OLLAS ARROCERAS ===
    Producto("OLL001", "Oster Multiusos 1.8L", 140.0, 40, 28, "Ollas arroceras", "https://hiraoka.com.pe/media/catalog/product/c/k/ckstrcb10dfblk-1.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=560&width=700&canvas=700:560"),
    Producto("OLL002", "Philips Antiadherente 2L", 190.0, 25, 30, "Ollas arroceras", "https://images.philips.com/is/image/philipsconsumer/vrs_85d50fd0f64a2d0a144fa46aaf5282863bbf390c?$png$&wid=632&hei=632"),
    Producto("OLL003", "Imaco Casserole 1.5L", 99.0, 50, 26, "Ollas arroceras", "https://simple.ripley.com.pe/product/_next/image?url=https%3A%2F%2Frimage.ripley.com.pe%2Fhome.ripley%2FAttachment%2FWOP%2F1%2F2019250281440%2Fimage1-2019250281440.&w=640&q=100"),
    Producto("OLL004", "Black+Decker Familiar 2.2L", 170.0, 15, 32, "Ollas arroceras", "https://mercury.vtexassets.com/arquivos/ids/23398955-800-800?v=639161594816570000&width=800&height=800&aspect=true"),
    Producto("OLL005", "Midea Digital 1.8L", 230.0, 18, 29, "Ollas arroceras", "https://media.falabella.com/falabellaPE/113990180_01/w=1200,h=1200,fit=pad"),
    Producto("OLL006", "Record Tradicional 1.8L", 120.0, 35, 28, "Ollas arroceras", "https://www.lacuracao.pe/media/catalog/product/r/e/re2106000007_11_dl5ztndqnfpifkz6.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700"),
    Producto("OLL007", "Recco Económica 1.2L", 79.0, 60, 24, "Ollas arroceras", "https://media.falabella.com/sodimacPE/1972774_01/w=1200,h=1200,fit=pad"),
    Producto("OLL008", "Oster Bioceramic 2.2L", 260.0, 10, 31, "Ollas arroceras", "https://media.falabella.com/falabellaPE/145270646_01/w=1200,h=1200,fit=pad"),

    // === COCINAS ===
    Producto("COC001", "Indurama Granada 4Q", 890.0, 8, 60, "Cocinas", "https://hiraoka.com.pe/media/catalog/product/g/r/granada_2_2.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=560&width=700&canvas=700:560"),
    Producto("COC002", "Mabe Inox 4 Hornillas", 980.0, 6, 55, "Cocinas", "https://oechsle.vteximg.com.br/arquivos/ids/21298846-1000-1000/2895927.jpg?v=638880700358100000"),
    Producto("COC003", "Sole de Empotrar 4Q", 750.0, 12, 60, "Cocinas", "https://media.falabella.com/falabellaPE/13798638_01/w=1200,h=1200,fit=pad"),
    Producto("COC004", "Bosch Pro 5 Hornillas", 1950.0, 4, 76, "Cocinas", "https://simple.ripley.com.pe/product/_next/image?url=https%3A%2F%2Frimage.ripley.com.pe%2Fhome.ripley%2FAttachment%2FWOP%2F1%2F2003326754327%2Ffull_image-2003326754327.jpg&w=640&q=100"),
    Producto("COC005", "Coldex Master 4Q", 820.0, 10, 58, "Cocinas", "https://estilospe.vtexassets.com/arquivos/ids/3531687-800-auto?v=638841275709970000&width=800&height=auto&aspect=true"),
    Producto("COC006", "Indurama Montecarlo 5Q", 1650.0, 5, 75, "Cocinas", "https://media.falabella.com/falabellaPE/152994552_03/w=1200,h=1200,fit=pad"),
    Producto("COC007", "Electrolux Triple Llama", 1420.0, 7, 76, "Cocinas", "https://simple.ripley.com.pe/product/_next/image?url=https%3A%2F%2Frimage.ripley.com.pe%2Fhome.ripley%2FAttachment%2FWOP%2F1%2F2003354437186%2Ffull_image-2003354437186.jpg&w=640&q=100"),
    Producto("COC008", "Surge de Mesa 2 Hornillas", 120.0, 40, 40, "Cocinas", "https://media.falabella.com/falabellaPE/149090765_01/w=1200,h=1200,fit=pad"),

    // === BATIDORAS ===
    Producto("BAT001", "Oster Pedestal 3.5L", 199.0, 15, 25, "Batidoras", "https://osterpe.vtexassets.com/arquivos/ids/156628-1600-auto?v=637503996053630000&width=1600&height=auto&aspect=true"),
    Producto("BAT002", "KitchenAid Artisan Pro", 1890.0, 5, 29, "Batidoras", "https://media.falabella.com/falabellaPE/139736152_01/w=1200,h=1200,fit=pad"),
    Producto("BAT003", "Philips de Mano Daily", 110.0, 30, 15, "Batidoras", "https://media.falabella.com/falabellaPE/116384621_01/w=1200,h=1200,fit=pad"),
    Producto("BAT004", "Bosch Styline 500W", 260.0, 12, 18, "Batidoras", "https://media.falabella.com/falabellaPE/145774780_01/w=1200,h=1200,fit=pad"),
    Producto("BAT005", "Imaco de Pedestal Inox", 150.0, 20, 24, "Batidoras", "https://simple.ripley.com.pe/product/_next/image?url=https%3A%2F%2Frimage.ripley.com.pe%2Fhome.ripley%2FAttachment%2FWOP%2F1%2F2019331728352%2Ffull_image-2019331728352&w=640&q=100"),
    Producto("BAT006", "Black+Decker 5 Velocidades", 125.0, 25, 16, "Batidoras", "https://m.media-amazon.com/images/I/618F04WijVL._AC_UF894,1000_QL80_.jpg"),
    Producto("BAT007", "Liliana Planetaria Smart", 450.0, 8, 28, "Batidoras", "https://www.novogar.com.ar/Image/0/700_700-AB925N_1.webp"),
    Producto("BAT008", "Finezza Semi-Industrial", 690.0, 6, 32, "Batidoras", "https://media.falabella.com/falabellaPE/145595699_01/w=1200,h=1200,fit=pad"),

    // === WAFLERAS ===
    Producto("WAF001", "Oster Antiadherente Belga", 135.0, 18, 22, "Wafleras", "https://media.falabella.com/falabellaPE/126910485_01/w=1200,h=1200,fit=pad"),
    Producto("WAF002", "Black+Decker 3 en 1", 210.0, 12, 24, "Wafleras", "https://media.falabella.com/falabellaPE/144264578_01/w=1200,h=1200,fit=pad"),
    Producto("WAF003", "Imaco Waflera Circular", 89.0, 30, 20, "Wafleras", "https://media.falabella.com/falabellaPE/140158261_01/w=1200,h=1200,fit=pad"),
    Producto("WAF004", "Cuisinart Double Waffle", 420.0, 5, 26, "Wafleras", "https://glazerpe.vtexassets.com/arquivos/ids/156441-800-auto?v=639059098784170000&width=800&height=auto&aspect=true"),
    Producto("WAF005", "Blanik Waffle Maker", 150.0, 14, 21, "Wafleras", "https://media.falabella.com/falabellaPE/146789835_01/w=1200,h=1200,fit=pad"),
    Producto("WAF006", "Recco Giratoria", 110.0, 22, 23, "Wafleras", "https://media.falabella.com/falabellaPE/881985225_1/w=1200,h=1200,fit=pad"),
    Producto("WAF007", "Krups Professional", 350.0, 6, 25, "Wafleras", "https://m.media-amazon.com/images/I/71uZsQP7NvL._AC_SY300_SX300_QL70_ML2_.jpg"),
    Producto("WAF008", "Westinghouse Mini Waffle", 69.0, 45, 15, "Wafleras", "https://media.doitcenter.com.pa/media/catalog/product/1/5/155swkpcm1261_vwos15viv1otr7iz.jpg?width=1080&quality=85&auto=webp"),

    // === LAVADORAS ===
    Producto("LAV001", "Samsung Carga Superior 13KG", 1390.0, 10, 61, "Lavadoras", "https://plazavea.vteximg.com.br/arquivos/ids/30851862-465-465/imageUrl_1.jpg"),
    Producto("LAV002", "LG Smart Inverter 16KG", 1750.0, 8, 63, "Lavadoras", "https://www.lg.com/content/dam/channel/wcms/pe/images/lavadoras/wt16bvtb/gallery/DZ-01.jpg/jcr:content/renditions/thum-1600x1062.jpeg?w=800"),
    Producto("LAV003", "Mabe Aqua Saver 19KG", 1990.0, 6, 68, "Lavadoras", "https://servicio.mabeglobal.com/medias/MABE-lavadora-19kg-blanca-LMH79104WBAB0-frente.jpg-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wxMDQzMzV8aW1hZ2UvanBlZ3xhVzFoWjJWekwyZ3pNaTlvTlRVdk9EZ3dNRGs1TURZeU5UZ3lNaTVxY0djfGZhMzY5MTI3YjlmYjNlZTM0ZjUyNTYwZWIzMDY4Nzk0MjVkMzUyOThjNTc5ZDA0OTE0ZjQ0YTYzOWIzMWYwOTM"),
    Producto("LAV004", "Daewoo Semiautomática 11KG", 650.0, 15, 58, "Lavadoras", "https://plazavea.vteximg.com.br/arquivos/ids/29261138-465-465/20425177.jpg"),
    Producto("LAV005", "Whirlpool Carga Frontal 20KG", 2890.0, 4, 69, "Lavadoras", "https://unitystores.vtexassets.com/arquivos/ids/161690-1600-1600?v=637240689241100000&width=1600&height=1600&aspect=true"),
    Producto("LAV006", "Panasonic Inverter 14KG", 1550.0, 9, 62, "Lavadoras", "https://hiraoka.com.pe/media/catalog/product/1/1/110578-01.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=560&width=700&canvas=700:560"),
    Producto("LAV007", "Electrolux Premium 17KG", 1850.0, 5, 66, "Lavadoras", "https://simple.ripley.com.pe/product/_next/image?url=https%3A%2F%2Fhome.ripley.com.pe%2FAttachment%2FWOP_5%2F2003235953101%2F2003235953101_2.jpg&w=640&q=100"),
    Producto("LAV008", "Winia Bubble Eco 15KG", 1290.0, 11, 63, "Lavadoras", "https://simple.ripley.com.pe/product/_next/image?url=https%3A%2F%2Frimage.ripley.com.pe%2Fhome.ripley%2FAttachment%2FWOP%2F1%2F2003255290958%2Ffull_image-2003255290958.&w=640&q=100")
)

  def verificarDisponibilidad(id: String): Boolean = {
    stockActual.exists(p => p.id == id && p.stock > 0)
  }

  def vender(id: String): String = {
    if (verificarDisponibilidad(id)) {
      stockActual = stockActual.map { p =>
        if (p.id == id) p.copy(stock = p.stock - 1) else p
      }
      guardarEstadoActual()
      "Venta procesada exitosamente en Scala e inventario actualizado."
    } else {
      "Error: Producto agotado o no existe en el sistema backend."
    }
  }

// Permite exponer de forma segura el inventario actual al servidor HTTP
  def obtenerTodos(): List[Producto] = {
    stockActual
  }

  private def guardarEstadoActual(): Unit = {
    val pw = new PrintWriter(new File("inventario_actualizado.txt"))
    try {
      pw.write("=== REPORTE DE INVENTARIO EN TIEMPO REAL (SCALA) ===\n")
      stockActual.foreach { p =>
        pw.write(s"ID: ${p.id} | Modelo: ${p.nombre} | Stock Restante: ${p.stock} un.\n")
      }
    } finally {
      pw.close()
    }
  }
}