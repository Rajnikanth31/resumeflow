import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
} from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import type { ResumeCustom } from "lib/redux/types";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
  template,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
  showBulletPoints: boolean;
  template?: string;
}) => {
  const { descriptions } = custom;

  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      template={template}
    >
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
        />
      </View>
    </ResumePDFSection>
  );
};
