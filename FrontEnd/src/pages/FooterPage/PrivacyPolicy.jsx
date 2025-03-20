import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const Container = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xxlarge};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

const Subtitle = styled.h2`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xlarge};
  color: ${theme.colors.primary};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};
  line-height: 1.8;
  margin-bottom: 1.5rem;
  padding-left: 2rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

export const PrivacyPolicy = () => {
  return (
    <Container>
      <Title>Política de Privacidade</Title>

      <Text>
        A sua privacidade é importante para nós. É política do Keeg Club respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Keeg Club, e outros sites que possuímos e operamos.
      </Text>

      <Subtitle>Coleta e Uso de Informações</Subtitle>
      <Text>
        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
      </Text>

      <Subtitle>Armazenamento e Proteção de Dados</Subtitle>
      <Text>
        Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
      </Text>

      <Subtitle>Compartilhamento de Informações</Subtitle>
      <Text>
        Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
      </Text>

      <Subtitle>Links Externos</Subtitle>
      <Text>
        O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
      </Text>

      <Subtitle>Direitos do Usuário</Subtitle>
      <Text>
        Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
      </Text>
      <Text>
        O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.
      </Text>

      <Subtitle>Publicidade e Cookies</Subtitle>
      <Text>
        O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um determinado anúncio é exibido para você.
      </Text>
      <Text>
        Para mais informações sobre o Google AdSense, consulte as FAQs oficiais sobre privacidade do Google AdSense.
      </Text>
      <Text>
        Utilizamos anúncios para compensar os custos de funcionamento deste site e fornecer financiamento para futuros desenvolvimentos. Os cookies de publicidade comportamental usados por este site foram projetados para garantir que você forneça os anúncios mais relevantes sempre que possível, rastreando anonimamente seus interesses e apresentando coisas semelhantes que possam ser do seu interesse.
      </Text>
      <Text>
        Vários parceiros anunciam em nosso nome, e os cookies de rastreamento de afiliados simplesmente nos permitem ver se nossos clientes acessaram o site através de um dos sites de nossos parceiros, para que possamos creditá-los adequadamente e, quando aplicável, permitir que nossos parceiros afiliados ofereçam qualquer promoção que possa fornecê-lo para fazer uma compra.
      </Text>

      <Subtitle>Compromisso do Usuário</Subtitle>
      <Text>
        O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Keeg Club oferece no site e com caráter enunciativo, mas não limitativo:
      </Text>
      <List>
        <li>Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;</li>
        <li>Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou de apologia ao terrorismo ou contra os direitos humanos;</li>
        <li>Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Keeg Club, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
      </List>

      <Subtitle>Mais Informações</Subtitle>
      <Text>
        Esperamos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
      </Text>
      <Text>
        Esta política é efetiva a partir de <strong>6 de março de 2025, 07:17</strong>.
      </Text>
    </Container>
  );
};